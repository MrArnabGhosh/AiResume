import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { summarySchema, SummaryValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import GenerateSummaryButton from "./GenerateSummaryButton";

export default function SummaryForm({resumeData,setResumeData}:EditorFormProps){
    const form=useForm<SummaryValues>({
        resolver:zodResolver(summarySchema),
        defaultValues:{
            summary:resumeData.summary || ""
        }

    })
    useEffect(() => {
        const subscription = form.watch((values) => {
            if (form.formState.isValid) {
                setResumeData({
                    ...resumeData,
                    summary: values.summary || "",  // ✅ fallback to empty string if undefined
                });
            }
        });
        return () => subscription.unsubscribe();
    }, [form, setResumeData]);


        return <div className="max-w-xl mx-auto space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="font-semibold text-2xl ">Professional Summary</h2>
                <p className="text-sm text-muted-foreground">Write a Short Introduction for your resume or
                    Let the AI generate one from your entered data.
                </p>
            </div>
            <Form {...form}>
                <form className="space-y-3">
                    <FormField 
                    control={form.control}
                    name="summary"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel className="sr-only">Professional Summary</FormLabel>
                            <FormControl>
                                <Textarea
                                {...field}
                                placeholder="A brief and engaging text about yourself"
                                />
                            </FormControl>
                            <FormMessage/>
                            <GenerateSummaryButton
                            resumeData={resumeData}
                            onSummaryGenerated={summary=>form.setValue("summary",summary)}
                            />
                        </FormItem>   
                    )}
                    />

                </form>
            </Form>
        </div>
}