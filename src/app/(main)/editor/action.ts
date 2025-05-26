"use server"

import prisma from "@/lib/prisma";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { date, string } from "zod";
import {del, put} from "@vercel/blob"
import path from "path";

export async function saveResume(values:ResumeValues) {
    const {id}=values
    console.log("recived values",values)
    const {photo,workExperience,educations,...resumeValues}=resumeSchema.parse(values)   
    
    const {userId}=await auth()
    if(!userId){
        throw new Error("User not Authenticated")
    }

    const existingResume = id
    ? await prisma.resume.findUnique({where:{id,userId}})
    :null;

    if(id && !existingResume){
        throw new Error("Resume Not Found")
    }

    let newPhotoUrl:string | undefined |null=undefined


    if(photo instanceof File){
        if(existingResume ?.photourl){
            await del(existingResume.photourl)
        }

        const blob = await put(`resume_photo/${path.extname(photo.name)}`,photo,{
            access:"public",
            addRandomSuffix: true,
        })

        newPhotoUrl = blob.url;
    }else if(photo===null){
        if(existingResume ?.photourl){
            await del(existingResume.photourl)
        }
        newPhotoUrl = null

    }

    if(id){
        return prisma.resume.update({
            where:{id},
            data:{...resumeValues,
            photourl:newPhotoUrl,
            workExperiences:{
                deleteMany:{},
                create: workExperience?.map(exp=>({
                    ...exp,
                    startDate:exp.startDate ? new Date(exp.startDate):undefined,
                    endDate: exp.startDate? new Date(exp.startDate):undefined, 
                }))
            },
             educations:{
                deleteMany:{},
                create: educations?.map(edu=>({
                    ...edu,
                    startDate:edu.startDate ? new Date(edu.startDate):undefined,
                    endDate: edu.startDate? new Date(edu.startDate):undefined, 
                }))
            },
            updatedAt: new Date(),
        
        }
        })
    }
    else{
        return prisma.resume.create({
            data:{...resumeValues,
            userId,
            photourl:newPhotoUrl,
            workExperiences:{
                create: workExperience?.map(exp=>({
                    ...exp,
                    startDate:exp.startDate ? new Date(exp.startDate):undefined,
                    endDate: exp.startDate? new Date(exp.startDate):undefined, 
                }))
            },
             educations:{
                create: educations?.map(edu=>({
                    ...edu,
                    startDate:edu.startDate ? new Date(edu.startDate):undefined,
                    endDate: edu.startDate? new Date(edu.startDate):undefined, 
                }))
            },
            // updatedAt: new Date(),
        
        }

        })
    }
}
