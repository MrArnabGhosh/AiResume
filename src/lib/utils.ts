import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ResumeServerData } from "./types"
import { ResumeValues } from "./validation"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function fileReplacer(key:unknown,value:unknown){
    return value instanceof File ? {
      name:value.name,
      size:value.size,
      type:value.type,
      lastModified:value.lastModified
    }:value
}

export function mapToResumeValues(data:ResumeServerData):ResumeValues{
  return {
    id: data.id,
    title:data.title  ||undefined,
    description:data.description||undefined,
    firstName:data.firstName||undefined,
    lastName:data.lastName||undefined,
    JobTitle:data.JobTitle||undefined,
    city:data.city||undefined,
    country:data.country||undefined,
    phone:data.phone||undefined,
    email:data.email||undefined,
    workExperience:data.workExperiences.map(exp=>({ 
      position:exp.position||undefined,
      company:exp.company||undefined,
      startDate:exp.startDate?.toString().split("T")[0],
      endDate:exp.endDate?.toString().split("T")[0],
      description:exp.description ||undefined
    })),
    educations:data.educations.map(edu=>({
      degree:edu.degree||undefined,
      school:edu.school||undefined,
      startDate:edu.startDate?.toISOString().split("T")[0],
      endDate:edu.endDate?.toISOString().split("T")[0]
    })),
    skills:data.skills,
    borderStyle:data.borderStyle,
    colorHex:data.colorHex,
    summary:data.summary||undefined,

  };
}