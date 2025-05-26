import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { steps } from "./steps";
import React from "react";

interface BreadcrumbsProps{
    currentStep:string;
    setCurrentSteps:(step:string)=> void;
}

export default function Breadcrumbs({currentStep,setCurrentSteps}:BreadcrumbsProps){
    return <div className="flex justify-center">
        <Breadcrumb>
            <BreadcrumbList>
                {steps.map(step =>(
                    <React.Fragment key={step.key}>
                        <BreadcrumbItem>
                            {step.key===currentStep ? (
                                    <BreadcrumbPage>
                                    {step.title}
                                    </BreadcrumbPage>
                            ):(
                                <BreadcrumbLink asChild>
                                    <button onClick={()=>setCurrentSteps(step.key)}>
                                        {step.title}
                                    </button>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="last:hidden"/>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>

    </div>

}