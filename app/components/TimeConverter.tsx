import { Text } from 'react-native'


const TimeConverter = (time:string) => {
  const array = time.split('-')
  const trimmed = array.map(x=>x.trim())
  const convert = (s:string) => {
    const sub = Number(s.slice(0,2))
    if(sub> 12){
        return String(sub % 12) +`:${s.slice(2)} pm`
    }
    return String(sub)+`:${s.slice(2)} am`
  }
  if(array.length == 2) {
    return (
        <Text>
            {convert(trimmed[0])} - {convert(trimmed[1])}
        </Text>
            )
    }
    
    return time
}

export default TimeConverter;