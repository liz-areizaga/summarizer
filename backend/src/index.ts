import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';

dotenv.config({path: "src/.env"});
async function listModels(): Promise<void> {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    
    const response = await openai.listModels();
    
    console.log("List of Models:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();