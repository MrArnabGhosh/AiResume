"use client"
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorFormProps } from "@/lib/types";
import { workExperienceSchema, workExperienceValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {CSS} from "@dnd-kit/utilities"
import { cn } from "@/lib/utils";
export default function WorkExperienceForm({
    resumeData,
    setResumeData
}: EditorFormProps) {
    const form = useForm<workExperienceValues>({
        resolver: zodResolver(workExperienceSchema),
        defaultValues: {
            workExperience: resumeData.workExperience || [],
        }
    });

    useEffect(() => {
        const subscription = form.watch((values) => {
            if (form.formState.isValid) {
                setResumeData({
                    ...resumeData,
                    workExperience:
                        values.workExperience?.filter(exp => exp !== undefined) || [],
                });
            }
        });
        return () => subscription.unsubscribe();
    }, [form, setResumeData]);

    const { fields, append, remove,move} = useFieldArray({
        control: form.control,
        name: "workExperience",
    });
    const sensors=useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor,{
            coordinateGetter:sortableKeyboardCoordinates
        }),
    )
    function handleDragEnd(event:DragEndEvent){
        const {active,over}=event

        if(over && active.id!==over.id){
            const oldIndex=fields.findIndex(field=>field.id===active.id)
            const newIndex=fields.findIndex(field =>field.id===over.id)
            move(oldIndex,newIndex)
            return arrayMove(fields,oldIndex,newIndex)
        }
    }
    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="space-y-1.5 text-center">
                <h2 className="text-2xl font-semibold ">Work Experience</h2>
                <p className="text-sm text-muted-foreground ">Add as many work experiences as you like.</p>
            </div>

            {/* ✅ Wrap the form inside FormProvider */}
            <FormProvider {...form}>
                <form className="space-y-3 ">
                    <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                    >
                    <SortableContext
                    items={fields}
                    strategy={verticalListSortingStrategy}
                    >
                        {fields.map((field, index) => (
                            <WorkExperienceItem
                                id={field.id}
                                key={field.id}
                                index={index}
                                form={form}
                                remove={remove}
                            />
                        ))}
                    </SortableContext>
                    </DndContext>
                    <div className="flex justify-center ">
                        <Button
                            type="button"
                            onClick={() => append({
                                position: "",
                                company: "",
                                startDate: "",
                                endDate: "",
                                description: ""
                            })}
                        >
                            Add Work Experience
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}

interface WorkExperienceItemProps {
    id:string;
    form: UseFormReturn<workExperienceValues>;
    index: number;
    remove: (index: number) => void;

}

function WorkExperienceItem({id, form, index, remove }: WorkExperienceItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    }=useSortable({id})
    return (
        <div className={cn("space-y-3 border rounded-md bg-background p-3",isDragging && "shadow-xl z-50 cursor-grab relative")}
        ref={setNodeRef}
        style={{
            transform:CSS.Transform.toString(transform),
            transition,
        }}
        >
            <div className="flex justify-between gap-2">
                <span className="font-semibold">Work Experience {index + 1}</span>
                <GripHorizontal className="size-5 cursor-grab text-muted-foreground focus:outline-none"
                {...attributes}
                {...listeners}

                />
            </div>

            <FormField
                control={form.control}
                name={`workExperience.${index}.position`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                            <Input {...field} autoFocus />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={`workExperience.${index}.company`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Company</FormLabel>
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
                    name={`workExperience.${index}.startDate`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                    value={field.value?.slice(0, 10)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`workExperience.${index}.endDate`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                    value={field.value?.slice(0, 10)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormDescription>
                Leave <span className="font-semibold">end date</span> empty if you are currently here
            </FormDescription>

            <FormField
                control={form.control}
                name={`workExperience.${index}.description`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <Button
                variant="destructive"
                type="button"
                onClick={() => remove(index)}
            >
                Remove
            </Button>
        </div>
    );
}
