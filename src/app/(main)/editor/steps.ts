import { EditorFormProps } from "@/lib/types";
import GeneralInfoForms from "./forms/GeneralInfoForms";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import { summarySchema } from "@/lib/validation";
import SummaryForm from "./forms/SummaryForm";

export const steps:{
    title:string;
    component:React.ComponentType<EditorFormProps>;
    key:string;
}[]=[
    {title:"General info",component:GeneralInfoForms, key:"general-info" },
    {title:"Personal info",component:PersonalInfoForm, key:"personal-info" },
    {title:"Work experience",component:WorkExperienceForm, key:"work-experience"},
    {title:"Education",component:EducationForm, key:"education"},
    {title:"Skills",component:SkillsForm, key:"skill"},
    {title:"Summary",component:SummaryForm, key:"summary"},
]