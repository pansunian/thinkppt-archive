import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedOutline } from "../types";

// 始终通过 process.env.API_KEY 初始化 GoogleGenAI 实例
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateSchemeOutline = async (topic: string): Promise<GeneratedOutline | null> => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is not configured.");
    return {
      title: "AI 功能暂不可用",
      sections: ["请检查环境变量配置以启用 AI 档案员。"]
    };
  }

  try {
    // 采用最新的 Gemini 3 Flash 模型
    const model = "gemini-3-flash-preview";
    const prompt = `你是一个专业的 PPT 方案策划专家，擅长逻辑架构与商业表达。
    请为主题：“${topic}” 创建一个富有深度和吸引力的 PPT 演示大纲。
    请返回一个具有冲击力的标题（title）和一个包含 4-6 个核心模块的列表（sections）。
    回答语言必须为中文，风格需专业且具有前瞻性。`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "PPT 的主标题" },
            sections: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "PPT 的核心章节大纲"
            }
          },
          required: ["title", "sections"]
        }
      }
    });

    // 按照新 SDK 规范直接通过 .text 获取返回的 JSON 字符串
    const jsonStr = response.text;
    if (!jsonStr) return null;
    
    return JSON.parse(jsonStr) as GeneratedOutline;

  } catch (error) {
    console.error("Gemini API 执行异常:", error);
    return null;
  }
};
