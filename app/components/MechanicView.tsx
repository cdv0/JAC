import { images } from '@/constants/images';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
type MechanicViewProps = {
    mechanicID: string,
    name: string,
    //rating: string,
    Image: string,
    Services: string,
    Certified:boolean,
}

type ReviewProps ={
    MechanicId:string,
    Rating: Float
}

export default function MechanicView(
    {
        name, Image:image, mechanicID, Certified
    }: MechanicViewProps){
        const[reviews, setReviews] = useState<any>([])
        const [reviewAVG, setreviewAVG] = useState<Float>(0);
        const [loading, setLoading] = useState(true);
        useEffect(() => {
                    const data = async () => {
                        try {
                            const file = await fetch("/local/dummy/review.json");
                            const reviewData = await file.json();
                            const reviews = JSON.parse(reviewData.body).filter((x:ReviewProps) =>x.MechanicId === mechanicID) as ReviewProps[]
                            setReviews(reviews || [])     
                            let sum = 0;
                            reviews.forEach(x=>{
                                sum+=x.Rating
                            }) 
                            setreviewAVG(sum/reviews.length)
                            setLoading(false)            
                        } catch (error) {
                            console.error("Error loading mechanics data:", error);
                        }
                       
                    }
                    data();
                }, [mechanicID]);

        if (loading){
            return(
              <View className='items-center justify-center border border-stroke py-[5%] w-[175] h-[250]' >
                <ActivityIndicator size="large" />
              </View>
            )
          }
          
                      
        return(
            
            <Link href={`../mechanic/${mechanicID}`} asChild>
                <TouchableOpacity style={{ width:175, height:250}}>
                    <View className = "w-full h-full rounded-xl border border-stroke py-[5%]">
                        {!image?(<images.defaultImage width={150} height={120} style={{alignSelf:'center'}} />):
                        <Image source={{uri:image}} className='w-[150] h-[120] self-center'/>
                        }
                        <View className ="my-[5%] ml-[15%]">
                            <View className="flex-row items-center">
                                <View className=' w-[80%]'>
                                    <Text className = {`text-xl buttonTextBlack mr-[5%]`}>
                                    {name.length>15?name.substring(0, 15)+"...":name}</Text>
                                </View>  
                                {Certified && <images.badge height={25} width={25} style={{marginTop:-20}}/> }
                            </View>
                                                       
                             <View className="flex-row ">
                                <Text className='buttonTextBlack'>Rating:</Text>
                                <StarRatingDisplay color={'black'} starSize={16} starStyle={{width:4}} style={{ alignItems:'center'}} rating={reviewAVG}/>
                                
                            </View> 
                            <Text className='buttonTextBlack'>Reviews: {reviews.length}</Text>
                        </View>
                    </View> 
                </TouchableOpacity>    
            </Link>
        )
}