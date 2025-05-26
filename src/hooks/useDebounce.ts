import { useEffect, useState } from "react";

export default function useDeBounce<T>(value:T,delay:number=250){
    const [deBounceValue,setDeBounceValue]=useState<T>(value)

    useEffect(()=>{
        const handler=setTimeout(() => {
            setDeBounceValue(value)
        },delay);
        return ()=>clearTimeout(handler)
    },[value,delay])

    return deBounceValue
}