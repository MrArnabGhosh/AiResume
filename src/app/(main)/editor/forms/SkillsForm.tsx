import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { skillsSchema, SkillsValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function SkillsForm({resumeData,setResumeData}:EditorFormProps){
    const form=useForm <SkillsValues>({
        resolver:zodResolver(skillsSchema),
        defaultValues:{
            skills:resumeData.skills || []

        }
    })

     useEffect(() => {
            const subscription = form.watch((values) => {
                if (form.formState.isValid) {
                    setResumeData({
                        ...resumeData,
                        skills:
                            values.skills?.filter(skill => skill !== undefined)
                            .map(skill=>skill.trim())
                            .filter(skill=>skill !=="") ||[],
                    });
                }
            });
            return () => subscription.unsubscribe();
        }, [form, setResumeData]);
        return <div className="max-w-xl mx-auto space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold">Skills</h2>
                <p className="text-sm text-muted-foreground">What are you good at?</p>
            </div>
        <Form {...form}>

            <form className="space-y-3">
                <FormField 
                control={form.control}
                name="skills"
                render={({field})=>(
                    <FormItem>
                        <FormLabel className="sr-only">Skills</FormLabel>
                        <FormControl>
                            <Textarea 
                            {...field}
                            placeholder="e.g. React.js,Node.js,Javascript,..."
                            onChange={(e)=>{
                                const skills=e.target.value.split(",")
                                field.onChange(skills);
                            }}
                            />
                        </FormControl>
                        <FormDescription>
                            Seperated each skill with a commma.
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}

                />
            </form>
        </Form>
        </div>
}