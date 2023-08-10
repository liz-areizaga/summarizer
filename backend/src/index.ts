import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';

dotenv.config({path: "src/.env"});
async function connectAPI(): Promise<void> {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    
    let toSummarize: string = "Addie had lived in Happyville since she was born. Next week, however, Addie and her family were moving over 1,000 miles away to Washington. Addie despised the idea of moving for many reasons. She was sad to be leaving her best friend. She had played on the soccer team for two years and didn’t want to leave her team. She would not be sleeping in her bedroom, which she loved and had decorated all by herself. She just hated the whole thing. Adie likes cheese.";

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{"role": "system", "content": "You are a summarizer."}, {role: "user", content: toSummarize}, ],
    });
    console.log(completion.data.choices[0].message?.content);
    
  } catch (error) {
    console.error("Error:", error);
  }
}

connectAPI();