import { Configuration, OpenAIApi } from "openai";
const dotenv = require('dotenv');

dotenv.config({path: ".env"});
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