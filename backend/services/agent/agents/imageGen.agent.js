import axios from "axios";
import { getModel } from "../config/llmModels.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";

export const imageGenAgent = async (state) => {
  try {
    await checkAgentLimit("image", state.userId);
    const llm = getModel("image");
    const res = await llm.invoke(`
    You are an elite AI image prompt engineer.

    Convert the user request into a highly detailed image generation prompt.

    Requirements:

    - Cinematic lighting
    - Professional composition
    - Ultra realistic
    - High detail
    - Beautiful color palette
    - Sharp focus
    - 8K quality
    - Photorealistic
    - Depth of field
    - Professional photography
    - Stunning visuals

    Return only the image prompt.

    User Request:${state.prompt}

    `);

    const prompt = res.content.trim();

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    const imageRes = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 60000,
    });

    const buffer = Buffer.from(imageRes.data);

    const filename = `image-${Date.now()}.png`;

    await uploadToS3(filename, buffer, "image/png");
    await deductCredits(state.userId, "vision");
    const downloadUrl = await getFromS3(filename, 1 * 10 * 60);

    return {
      ...state,
      aiResponse: `# 🖼️ Image Generated Successfully

![Generated Image](${downloadUrl})

📥 [Download Image](${downloadUrl})
⏳ Link expires in 10 minutes.`,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to generate image.",
    };
  }
};
