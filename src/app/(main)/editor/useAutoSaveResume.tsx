import { useToast } from "@/hooks/use-toast";
import useDebounce from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { resolve } from "path";
import { use, useEffect, useState } from "react";
import { saveResume } from "./action";
import { Button } from "@/components/ui/button";
import { fileReplacer } from "@/lib/utils";

export default function useAutoSaveResume(resumeData:ResumeValues){

    const searchParams=useSearchParams()


    const {toast}=useToast();


    const debounceResumeData=useDebounce(resumeData,1500)
    const [resumeId,setResumeId]=useState(resumeData.id)

    const [lastSavedData,setLastSavedData]=useState(
        structuredClone(resumeData)
    )

    const [isSaving,setIsSaving]=useState(false)
    const[isError,setIsError]=useState(false)
    useEffect(()=>{
        setIsError(false)
    },[debounceResumeData])

    useEffect(()=>{
        async function save(){
            try {
                setIsSaving(true)
                setIsError(false)
                const newData=structuredClone(debounceResumeData)


                const updatedResume= await saveResume({
                    ...newData,
                    ...(JSON.stringify(lastSavedData.photo,fileReplacer)===(newData.photo) &&{
                        photo:undefined
                    }),
                    id:resumeId
                })

                setResumeId(updatedResume.id)
                setLastSavedData(newData)
                if(searchParams.get("resumeId")!== updatedResume.id){
                    const newSearchParams=new URLSearchParams(searchParams)
                    newSearchParams.set("resumeId",updatedResume.id)
                    window.history.replaceState(null,"",`?${newSearchParams.toString()}`)

                }
            } catch (error) {
                setIsError(true)
                console.error(error)
                const {dismiss}=toast({
                    variant:"destructive",
                    description:(
                        <div className="space-y-3">
                            <p>Could not Save changes.</p>
                            <Button
                            variant="secondary"
                            onClick={()=>{
                                dismiss();
                                save();
                            }}
                            >
                                Retry
                            </Button>
                        </div>
                )
                })
            }
            finally{
                setIsSaving(false);
            }
        }
        console.log("debounceResumeData",JSON.stringify(debounceResumeData,fileReplacer))
        console.log("lastSavedData",JSON.stringify(lastSavedData,fileReplacer))

        const hasUnsaveChanges=JSON.stringify(debounceResumeData,fileReplacer)
        !==JSON.stringify(lastSavedData,fileReplacer)

        if(hasUnsaveChanges && debounceResumeData && !isSaving  && !isError){
            save()
        }
    },[debounceResumeData,isSaving,lastSavedData,isError,resumeId,searchParams,toast]);

    return {
        isSaving,
        hasUnsaveChanges:JSON.stringify(resumeData) !==JSON.stringify(lastSavedData)
    }
}