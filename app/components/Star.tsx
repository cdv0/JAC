import { MaterialIcons } from '@expo/vector-icons';
interface Prop{
    size:number,
    color:string,
    type:string
}

const Star = ({ size, color, type }: Prop) => {
    const name = type === 'full' ? 'star' :type === 'half' ? 'star-half' :'star-outline';
  return (
     <MaterialIcons name={name} size={size} color={color} />
  )
}

export default Star