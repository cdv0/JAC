import { images } from '@/constants/images';
import { Link } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import Star from './Star';
type MechanicViewProps = {
    mechanicID: string,
    name: string,
    Image: string,
    Certified:boolean,
    Distance?: number,
    Rating: number,
    Review: number
}


export default function MechanicView(
    {
        name, Image:image, mechanicID, Certified, Distance, Rating, Review
    }: MechanicViewProps){
                      
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
                                <StarRatingDisplay color={'black'} starSize={18} starStyle={{ marginHorizontal: -1 }} StarIconComponent={Star} style={{ alignItems:'center'}} rating={Rating} />
                                
                            </View> 
                            <Text className='buttonTextBlack'>Reviews: {Review}</Text>
                            {(Distance && Distance !== Number.POSITIVE_INFINITY) && <Text className='text-s smallTextGray'>{Distance.toFixed(1)} mi</Text>}
                        </View>
                    </View> 
                </TouchableOpacity>    
            </Link>
        )
}