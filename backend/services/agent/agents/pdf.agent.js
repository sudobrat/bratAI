import { getModel } from "../config/llmModels.js";
import { generatePDF } from "../utils/generatePDF.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pdfAgent = async (state) => {
  try {
    await checkAgentLimit("pdf", state.userId);
    const llm = getModel("pdf");
    const prompt = `You are an expert document writer.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations.

- Do NOT write a guide, tutorial, or instructions on how to create, format, or code a PDF.
- Do NOT include placeholder bullet points like "Define...", "Explain...", or "Select a library...".
- Strip out any user command phrasing (e.g., if the user says "Make a PDF on X", write the actual document content about X)

Structure:

{
  "title":"",
  "subtitle":"",
  "sections":[
    {
      "heading":"",
      "points":[]
    }
  ]
}

Generate 4-8 sections.

Each section should have 3-6 concise bullet points.

Topic:
${state.prompt}`;

    const res = await llm.invoke(prompt);

    const data = JSON.parse(res.content);
    await deductCredits(state.userId, "pdf");
    const pdfBuffer = await generatePDF(data);
    const filename = `pdf-${Date.now()}.pdf`;

    await uploadToS3(filename, pdfBuffer, "application/pdf");
    const downloadUrl = await getFromS3(filename, 1 * 10 * 60);

    return {
      ...state,
      aiResponse: `# 📑 PDF Generated Successfully

**${data.title}**

📥 [Download PDF](${downloadUrl})
⏳ Link expires in 10 minutes.`,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to generate PDF",
    };
  }
};
