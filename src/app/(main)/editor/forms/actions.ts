"use server"


import openai from "@/lib/openai";
import { GenerateSummaryInput, generateSummarySchema, GenerateWorkExperienceInput, generateWorkExperienceSchema, workExperience } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";

export async function generateSummary(input:GenerateSummaryInput) {
    const {JobTitle,workExperience,educations,skills}=generateSummarySchema.parse(input)

    const systemMessage = `
        You are a job resume generator AI.Your task is to write a professional introduction summary for a resume given the users provided data.Only return the summary and do not include any other information in the reesponse.Keep it concise and professional.
    `
    const userMessage = `
        Plese genetare a professional resume summary for this data:

        Job Title:${JobTitle || "N/A"}


        work Experience:${workExperience?.map(exp=>
            `
            Position:${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "present"}
            Description:${exp.description || "N/A"}
            `,
        ).join("\n\n")
    }

    Education:${educations?.map(edu=>
            `
            Degree:${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "present"}
            `,
        ).join("\n\n")
    }
    Skills:${skills}

    `;

    console.log("systemMessage",systemMessage)
    console.log("userMessage",userMessage)

//      const aiResponse = await getGeminiResponse(systemMessage + "\n\n" + userMessage); // Concatenate messages for the single prompt

//     if(!aiResponse){
//         throw new Error("Failed to generate AI response");
//     }
//     return aiResponse;
// }

    const completion = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages:[
            {
                role:"system",
                content:systemMessage,
            },
            {
                role:"user",
                content:"userMessage"
            }
        ]
    })

    const aiResposne= completion.choices[0].message.content;

    if(!aiResposne){
        throw new Error("Failed to generate AI response")
    }
    return aiResposne;
}
export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

//   const subscriptionLevel = await getUserSubscriptionLevel(userId);

//   if (!canUseAITools(subscriptionLevel)) {
//     throw new Error("Upgrade your subscription to use this feature");
//   }

  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
  You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
  Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

  Job title: <job title>
  Company: <company name>
  Start date: <format: YYYY-MM-DD> (only if provided)
  End date: <format: YYYY-MM-DD> (only if provided)
  Description: <an optimized description in bullet format, might be inferred from the job title>
  `;

  const userMessage = `
  Please provide a work experience entry from this description:
  ${description}
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  console.log("aiResponse", aiResponse);

  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies workExperience;
}