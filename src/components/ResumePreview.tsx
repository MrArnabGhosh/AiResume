// src/components/ResumePreview.tsx
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";

import Image from "next/image";
import React from "react";
import { useRef,RefObject, useState, useEffect } from "react";
import { format } from "date-fns"; 
import { Badge } from "./ui/badge";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";

interface ResumePreviewProps {
    resumeData:ResumeValues;
    contentRep?:React.Ref<HTMLDivElement>
    className?:string;
    contentRef?:React.Ref<HTMLDivElement>
}

export default function ResumePreview({
    resumeData,
    contentRef,
    className,
    }: ResumePreviewProps){
    const containerRef=useRef<HTMLDivElement>(null);
    const {width}=useDimensions(containerRef);

    return <div className={cn("bg-white text-black h-fit w-full aspect-[210/297]",className)}
        ref={containerRef}
    >
        <div className={cn("space-y-6 p-6",!width && "invisible" )}
            style={{
                zoom:(1/794)*width,
            }}
            ref={contentRef}
            id="ResumePreviewContent"
        >
            {/* <pre>{JSON.stringify(resumeData,null,2)}</pre> */}
        <PersonalInfoHeader resumeData={resumeData}/>
        <SummarySection resumeData={resumeData}/>
        <WorkExprerienceSection resumeData={resumeData}/>
        <EducationSection resumeData={resumeData}/>
        <SkillSection resumeData={resumeData}/>

        </div>
    </div>
}

interface ResumeSectionProps{
    resumeData:ResumeValues
}


function formatDate(dateInput: string | Date | null | undefined, formatStr: string): string {
    if (!dateInput) {
        return "";
    }

    let date: Date;
    if (dateInput instanceof Date) {
        date = dateInput;
    } else {
        date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) {
        console.warn(`Invalid date value provided to formatDate: '${dateInput}'. Returning empty string.`);
        return "";
    }
    return format(date, formatStr);
}



function PersonalInfoHeader({resumeData}:ResumeSectionProps){
    const {photo,firstName,lastName,JobTitle,city,country,phone,email,colorHex,borderStyle}=resumeData;

        const [photoSrc,setPhotoSrc]=useState(photo instanceof File? "":photo)

        useEffect(()=>{
            const objectUrl=photo instanceof File? URL.createObjectURL(photo):""
            if(objectUrl) setPhotoSrc(objectUrl)
                if(photo===null)setPhotoSrc("")
            return ()=> URL.revokeObjectURL(objectUrl)
        },[photo])


    return <div className="flex items-center gap-6">
        {photoSrc && (
            <Image
            src={photoSrc}
            width={100}
            height={100}
            alt="Author Photo"
            className="aspect-square object-cover"
            style={{borderRadius:borderStyle===BorderStyles.SQUARE 
                ? "0px"
                :borderStyle===BorderStyles.CIRCLE 
                ?"999px"
                :"10%"
            }}
            />
        )}
        <div className="space-y-2.5">
            <div className="space-y-1">
                <p className="text-3xl font-bold" style={{
                    color:colorHex
                }}>{firstName} {lastName}</p>
                <p className="font-medium"
                    style={{
                    color:colorHex
                }}
                >{JobTitle}</p>
            </div>
            <p className="text-xs text-gray-500">
                {city}
                {city && country ?", ":""}
                {country}
                {(city || country) && (phone || email)? " • ":""}
                {[phone,email].filter(Boolean).join(" • ")}


            </p>
        </div>
    </div>
}

function SummarySection({resumeData}:ResumeSectionProps){
    const {summary,colorHex} = resumeData

    if(!summary)return null;

    return <>
    <hr className="border-2"
    style={{
     borderColor:colorHex
    }}
    />
    <div className="space-y-3 break-inside-avoid">
        <p className="text-lg font-semibold">Professional profile</p>
        <div className="whitespace-pre-line text-sm ">{summary}</div>
    </div>
    </>
}

function WorkExprerienceSection({resumeData}:ResumeSectionProps){
    const {workExperience,colorHex} = resumeData 

    const workExperienceNotEmpty = workExperience?.filter(
        (exp)=>Object.values(exp).filter(Boolean).length>0,
    )
    if(!workExperienceNotEmpty?.length) return null;
    return <>
            <hr className="border-2" style={{
                    borderColor:colorHex
                }}/>
            <div className="space-y-3 ">
            <p className="text-lg font-semibold" style={{color:colorHex}}>
                Work Experience
            </p>
            {workExperienceNotEmpty.map((exp,index)=>(
                <div key={index} className="break-inside-avoid space-y-1">
                    <div className="flex items-center justify-between text-sm font-semibold"
                        style={{
                    color:colorHex
                }}
                    >
                        <span>{exp.position}</span>
                        {exp.startDate && (
                            <span>
                                {formatDate(exp.startDate,"MM/yyyy")} -{" "}
                                {exp.endDate === 'present'
                                    ? "Present"
                                    : formatDate(exp.endDate, "MM/yyyy") || "Present"
                                }
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-semibold">{exp.company}</p>
                    <div className="whitespace-pre-line text-xs">
                        {exp.description}
                    </div>
                    </div>
            ))}
        </div>
    </>
}


function EducationSection({resumeData}:ResumeSectionProps){
    const {educations,colorHex}=resumeData;

    const educationNotEmpty = educations?.filter(
        (edu)=>Object.values(edu).filter(Boolean).length>0,
    )
    if(!educationNotEmpty?.length)return null;

    return <>
           <hr className="border-2" style={{
                    borderColor:colorHex
                }}/>
            <div className="space-y-3 ">
            <p className="text-lg font-semibold" style={{color:colorHex}}>
                Education
            </p>
            {educationNotEmpty.map((edu,index)=>(
                <div key={index} className="break-inside-avoid space-y-1">
                    <div className="flex items-center justify-between text-sm font-semibold"
                    style={{
                    color:colorHex
                    }}
                    >
                        <span>{edu.degree}</span>
                        {edu.startDate && (
                            <span>
                                {formatDate(edu.startDate, "MM/yyyy")} -{" "}
                                {edu.endDate === 'present'
                                    ? "Present"
                                    : formatDate(edu.endDate, "MM/yyyy") || "Present"
                                }
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-semibold">{edu.school}</p>
                    </div>
            ))}
        </div>
    </>
}

function SkillSection({resumeData}:ResumeSectionProps){
    // Changed 'borderStyle' to 'boderStyle' here
    const {skills,colorHex,borderStyle}=resumeData

    if(!skills?.length) return null;

    return <>
    <hr className="border-2"
        style={{
        borderColor:colorHex
        }}
    />
    <div className="break-inside-avoid space-y-3">
        <p className="text-lg font-semibold"
            style={{
            color:colorHex
               }}
        >Skills</p>
        <div className="flex break-inside-avoid flex-wrap gap-2">
            {skills.map((skill,index)=>(
                <Badge key={index} className="bg-black hover:bg-black text-white rounded-md"
                   style={{
                    backgroundColor:colorHex,
                    borderRadius:borderStyle===BorderStyles.SQUARE // Changed 'borderRadius' to 'boderRadius' here, assuming this is also a typo in your CSS or logic? If not, change this back to 'borderRadius'
                ? "0px"
                :borderStyle===BorderStyles.CIRCLE // Changed 'borderStyle' to 'boderStyle'
                ?"999px"
                :"8px"
            }}
                >

                    {skill}
                </Badge>
            ))}
        </div>
    </div>

    </>
}