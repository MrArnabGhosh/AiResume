
import { Description } from "@radix-ui/react-toast";
import {z} from "zod"
export const optionalString= z.string().trim().optional().or(z.literal(""));

export const generalInfoSchema=z.object({
    title:optionalString,
    description:optionalString,
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;


export const personalInfoSchema=z.object({
    photo:z.custom<File |undefined>()
    .refine(
        (file)=> !file || (file instanceof File && file.type.startsWith("image/")),
        "Must be an Image File"
    )
    .refine(
        (file)=>!file || file.size<=1024*1024*5,
        "File Must be less than 4MB"
    ),
    firstName:optionalString,
    lastName:optionalString,
    JobTitle:optionalString,
    city:optionalString,
    country:optionalString,
    phone:optionalString,
    email:optionalString,
});

export type personalInfoValues=z.infer<typeof personalInfoSchema>;

export const workExperienceSchema = z.object({
    workExperience:z.array(
        z.object({
            position:optionalString,
            company:optionalString,
            startDate:optionalString,
            endDate:optionalString,
            description:optionalString
        })
    )
    .optional(),  
});

export type workExperienceValues= z.infer<typeof workExperienceSchema>
export type workExperience = NonNullable<z.infer<typeof workExperienceSchema>["workExperience"]>[number]
export const educationSchema=z.object({
    educations:z.array(
        z.object({
            degree:optionalString,
            school:optionalString,
            startDate:optionalString,
            endDate:optionalString,
        })
    ).optional(),
})
export type EducationValues =z.infer<typeof educationSchema>

export const skillsSchema= z.object({
    skills:z.array(z.string().trim()).optional()
    
})
export type SkillsValues =z.infer<typeof skillsSchema>



export const summarySchema=z.object({
    summary:optionalString
})
export type SummaryValues=z.infer<typeof summarySchema>


export const resumeSchema=z.object({
    ...generalInfoSchema.shape,
    ...personalInfoSchema.shape,
    ...workExperienceSchema.shape,
    ...educationSchema.shape,
    ...skillsSchema.shape,
    ...summarySchema.shape,

    colorHex:optionalString,
    borderStyle:optionalString,
    
    
})

export type ResumeValues = Omit<z.infer<typeof resumeSchema> ,"photo"> &{
    id?:string
    photo?:File|string|null;
}

export const generateWorkExperienceSchema = z.object({
    description:z.string().trim().min(1,"Required").min(20,"Must be at least 20 character")
})
export type GenerateWorkExperienceInput=z.infer<
    typeof generateWorkExperienceSchema
>

export const generateSummarySchema= z.object({
    JobTitle:optionalString,
    ...workExperienceSchema.shape,
    ...educationSchema.shape,
    ...skillsSchema.shape,
})
export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>