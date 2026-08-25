import { getModel } from "../config/llmModels.js";
import { generatePPT } from "../utils/generatePPT.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const pptAgent = async (state) => {
  try {
    await checkAgentLimit("ppt", state.userId);
    const llm = getModel("ppt");
    const prompt = `You are a professional presentation designer.

Return ONLY valid JSON.

Format:

{
  "title":"",
  "subtitle":"",
  "slides":[
    {
      "title":"",
      "points":[
        "",
        "",
        "",
        ""
      ]
    }
  ]
}

Rules:

- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.

Topic:
${state.prompt}`;

    const res = await llm.invoke(prompt);

    const data = JSON.parse(res.content);
    await deductCredits(state.userId, "ppt");

    const ppt = await generatePPT(data);
    const buffer = await ppt.write({ outputType: "nodebuffer" });
    const filename = `ppt-${Date.now()}.pptx`;

    await uploadToS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
    const downloadUrl = await getFromS3(filename, 1 * 10 * 60);

    return {
      ...state,
      aiResponse: `# 📁 PPT Generated Successfully

**${data.title}**

📥 [Download PPT](${downloadUrl})
⏳ Link expires in 10 minutes.`,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to generate PPT",
    };
  }
};
