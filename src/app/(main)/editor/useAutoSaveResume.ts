import useDeBounce from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { resolve } from "path";
import { useEffect, useState } from "react";

export default function useAutoSaveResume(resumeData:ResumeValues){
    const deBounceResumeData=useDeBounce(resumeData,1500)
    const [lastSavedData,setLastSavedData]=useState(
        structuredClone(resumeData)
    )

    const [isSaving,setIsSaving]=useState(false)

    useEffect(()=>{
        async function save(){
            setIsSaving(true)
            await new Promise(resolve=>setTimeout(resolve,1500))
            setLastSavedData(structuredClone(deBounceResumeData))
            setIsSaving(false)
        }

        const hasUnSaveChanges=JSON.stringify(deBounceResumeData)
        !==JSON.stringify(lastSavedData)

        if(hasUnSaveChanges && deBounceResumeData && !isSaving){
            save()
        }
    },[deBounceResumeData,isSaving,lastSavedData]);

    return {
        isSaving,
        hasUnSaveChanges:JSON.stringify(resumeData) !==JSON.stringify(lastSavedData)
    }
}