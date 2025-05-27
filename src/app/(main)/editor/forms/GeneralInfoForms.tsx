"use client" 
import React from "react"
import { GeneralInfoValues,generalInfoSchema } from "@/lib/validation"
import {  useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage,Form, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { EditorFormProps } from "@/lib/types"
import { useEffect } from "react"


export default function GeneralInfoForms({resumeData,setResumeData}:EditorFormProps){

    const form=useForm<GeneralInfoValues>({
        resolver:zodResolver(generalInfoSchema),
        defaultValues:{
            title:resumeData.title||"",
            description:resumeData.description||"",
        },
    });

useEffect(() => {
    const subscription = form.watch((values) => {
        if (form.formState.isValid) {
            setResumeData({...resumeData,...values});
        }
    });
    return () => subscription.unsubscribe();
}, [form, setResumeData]);



    return (
    <div className="max-w-xl mx-auto space-y-6">
        <div className="space-y-1.5 text-center">
            <h2 className="text-2xl font-semibold ">General Info</h2>
            <p className="text-sm text-muted-foreground">This will not appear on your Resume</p>

        </div>
        <Form {...form}>
            <form className="space-y-3">
                <FormField 
                control={form.control}
                name= "title"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>project Name</FormLabel>
                        <FormControl>
                            
                            <Input {...field} placeholder="my cool resume "autoFocus/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                 <FormField 
                control={form.control}
                name= "description"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            
                            <Input {...field} placeholder="A resume for my next job"autoFocus/>
                        </FormControl>
                        <FormDescription>
                            Describe what this resume is for
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
                />
            </form>
        </Form>
    </div>)
}