import { images } from '@/constants/images';
import { Link } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
type MechanicViewProps = {
    mechanicID: string,
    name: string,
    //rating: string,
    Review: string,
    Image: string,
    Services: string[],
    //certified:boolean,
}

export default function MechanicView(
    {
        name, Review, Image:image, mechanicID
    }: MechanicViewProps){
                      
        return(
            
            <Link href={`../mechanic/${mechanicID}`} asChild>
                <TouchableOpacity style={{ width:175, height:250, marginBottom:'5%', marginHorizontal:'3%'}}>
                    <View className = "w-full h-full rounded-xl border border-stroke py-[5%]">
                        {!image?(<images.defaultImage width={150} height={150} style={{alignSelf:'center'}} />):
                        <Image source={{uri:image}} className='w-[150] h-[150] self-center'/>
                        }
                        <View className ="my-[5%] ml-[15%]">
                            <View className="flex-row">
                                <Text className = {`text-xl buttonTextBlack mr-[5%]`}>{name}</Text>
                                {/* {certified && <images.badge height={25}/>} */}
                            </View>
                            
                            {/* <Text className = {`text-l buttonTextGray`}>Type: {type}</Text> */}
                           
                            {/* <View className="flex-row ">
                                <Text>Rating:</Text>
                                <StarRatingDisplay color={'black'} starSize={16} starStyle={{width:4}} style={{ alignItems:'center'}} rating={parseFloat(rating)}/>
                                
                            </View> */}
                            <Text>Reviews: {Review}</Text>
                        </View>
                    </View> 
                </TouchableOpacity>    
            </Link>
        )
}