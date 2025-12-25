import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedOutline } from "../types";

// Always use named parameter for apiKey and use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSchemeOutline = async (topic: string): Promise<GeneratedOutline | null> => {
  // Use process.env.API_KEY directly as it is guaranteed to be available in this context.
  if (!process.env.API_KEY) {
    console.warn("No API Key provided for Gemini.");
    return {
      title: "API KEY 未配置",
      sections: ["请在后台配置您的 API Key 以使用 AI 档案员功能。"]
    };
  }

  try {
    // Use gemini-3-flash-preview for better quota limits and speed.
    const model = 'gemini-3-flash-preview';
    const prompt = `你是一个专业的PPT方案策划师。请为主题：“${topic}” 创建一个PPT演示大纲。
    返回一个吸引人的标题（Title）和一个包含 4-6 个关键部分的列表（Sections）。
    请使用中文回答，语气专业、富有逻辑性。`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    // Access .text property directly (not as a function).
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as GeneratedOutline;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};