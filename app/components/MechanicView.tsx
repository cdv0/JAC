import { images } from '@/constants/images';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import Star from './Star';
type MechanicViewProps = {
    mechanicID: string,
    name: string,
    Image: string,
    Services: string,
    Certified:boolean,
    Distance?: number,
}

type ReviewProps ={
    mechanicId:string,
    rating: number
}

export default function MechanicView(
    {
        name, Image:image, mechanicID, Certified, Distance
    }: MechanicViewProps){
        const[reviews, setReviews] = useState<any>([])
        const [reviewAVG, setreviewAVG] = useState<Float>(0);
        const [loading, setLoading] = useState(true);
        useEffect(() => {
                    const data = async () => {
                        try {
                            const file = await fetch("/local/dummy/review2.json");
                            const reviewData = await file.json();
                            const reviews = reviewData.filter((x:ReviewProps) =>x.mechanicId === mechanicID) as ReviewProps[]
                            setReviews(reviews || [])     
                            let sum = 0;
                            reviews.forEach(x=>{
                                sum+=x.rating
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
              <View className='items-center rounded-xl justify-center border border-stroke py-[5%] w-[175] h-[250]' >
                <ActivityIndicator size="large" />
              </View>
            )
          }
          
                      
        return(
            
            <Link href={`../mechanic/${mechanicID}`} asChild>
                <TouchableOpacity style={{ width:175, height:270,}}>
                    <View className = "w-full h-full rounded-xl border border-stroke py-[2%]">
                        <View className='items-center mt-[10]'>
                            {!image?(<images.defaultImage width={150} height={120} />):
                                <Image source={{uri:image}} className='w-[150] h-[120] '/>
                            }
                        </View>
                        
                        <View className ="my-[5%] ml-[15%]">
                            <View className="flex-row items-center">
                                <View className=' w-[80%]'>
                                    <Text className = {`text-xl buttonTextBlack mr-[5%]`}>
                                    {name.length>18?name.substring(0, 15)+"...":name.length<13?name + '\n':name}</Text>
                                </View>  
                                {Certified && <images.badge height={25} width={25} style={{marginTop:-20}}/> }
                            </View>
                                                       
                             <View className="flex-row ">
                                <Text className='buttonTextBlack'>Rating:</Text>
                                {/*todo: Fix inconsisent star sizes */}
                                <StarRatingDisplay color={'black'} starSize={18} starStyle={{ marginHorizontal: -1 }} StarIconComponent={Star} style={{ alignItems:'center'}} rating={reviewAVG } />
                                
                            </View> 
                            <Text className='buttonTextBlack'>Reviews: {reviews.length}</Text>
                            {(Distance && Distance !== Number.POSITIVE_INFINITY) && <Text className='text-s smallTextGray'>{Distance.toFixed(1)} mi</Text>}
                        </View>
                    </View> 
                </TouchableOpacity>    
            </Link>
        )
}