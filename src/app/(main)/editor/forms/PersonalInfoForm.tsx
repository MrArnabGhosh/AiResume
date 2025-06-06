"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { EditorFormProps } from "@/lib/types"
import { personalInfoSchema, personalInfoValues } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect,useRef } from "react"
import { useForm } from "react-hook-form"

export default function PersonalInfoForm({
    resumeData,
    setResumeData,
    }:EditorFormProps){
    const form=useForm<personalInfoValues>({
        resolver:zodResolver(personalInfoSchema),
        defaultValues : {
            firstName :resumeData.firstName|| "",
            lastName: resumeData.lastName|| "",
            jobTitle:resumeData.jobTitle|| "",
            city:resumeData.city|| "",
            country:resumeData.country|| "",
            phone:resumeData.phone|| "",
            email:resumeData.email|| "",
        }
    })

    // useEffect(()=>{
    //     const { unsubscribe }=form.watch(async(values)=>{
    //         const isValid=await form.trigger();        //if page freeze comment the whole usestate
    //         if(!isValid) return;
    //         setResumeData({...resumeData,...values})
    //     });
    //     return unsubscribe
    // },[form,resumeData,setResumeData])
        useEffect(() => {
        const subscription = form.watch((values) => {
            if (form.formState.isValid) {
                setResumeData({...resumeData,...values});
            }
        });
        return () => subscription.unsubscribe();
    }, [form, setResumeData]);
    const photoInputRef=useRef<HTMLInputElement>(null)


    return <div className="max-w-xl mx-auto space-y-6">
        <div className="space-y-1.5 text-center">
            <h2 className="text-2xl font-semibold">personal info</h2>
            <p className="text-muted-foreground ">Tell us about yourself</p>
        </div>
        <Form {...form}>
            <form className="space-y-3">
                <FormField
                control={form.control}
                name="photo"
                render={({field:{value,...fieldValues}})=>(
                    <FormItem>
                        <FormLabel>
                            your photo
                        </FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl>
                                <Input {...fieldValues} 
                                type="file" 
                                accept="image/*" 
                                onChange={(e)=>{
                                const file = e.target.files?.[0]
                                fieldValues.onChange(file)
                                }}
                                ref={photoInputRef}
                                />
                            </FormControl>
                            <Button 
                            variant="secondary"
                            type="button"
                            onClick={()=>{
                                fieldValues.onChange(null)
                                if(photoInputRef.current){
                                    photoInputRef.current.value=""
                                }
                            }}
                            >
                                Remove
                            </Button>
                        </div>
                        <FormMessage/>
                    </FormItem>
                )}
                />
                <div className="grid grid-cols-2 gap-3">
                     <FormField
                         control={form.control}
                         name="firstName"
                         render={({ field }) => (
                    <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
                         control={form.control}
                         name="lastName"
                         render={({ field }) => (
                    <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                    )}
                />
                    </div>
                    <FormField
                         control={form.control}
                         name="jobTitle"
                         render={({ field }) => (
                    <FormItem>
                    <FormLabel>job Title</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-3">
                     <FormField
                         control={form.control}
                         name="city"
                         render={({ field }) => (
                    <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
                     <FormField
                         control={form.control}
                         name="country"
                         render={({ field }) => (
                    <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                         </FormItem>
                         )}
                    />
        </div>
                    <FormField
                         control={form.control}
                         name="phone"
                         render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                        <Input {...field} type="tal"/>
                    </FormControl>
                    <FormMessage />
                         </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name="email"
                         render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input {...field} type="email"/>
                    </FormControl>
                    <FormMessage />
                         </FormItem>
                         )}
                    />
            </form>
        </Form>
    </div>
}