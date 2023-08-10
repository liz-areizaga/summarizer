import React from 'react';
import './App.css';
import { Box, Button, TextField} from '@mui/material';

function App() {

  const handleSubmit = async () => {
    let toSummarize: string = "Addie had lived in Happyville since she was born. Next week, however, Addie and her family were moving over 1,000 miles away to Washington. Addie despised the idea of moving for many reasons. She was sad to be leaving her best friend. She had played on the soccer team for two years and didn’t want to leave her team. She would not be sleeping in her bedroom, which she loved and had decorated all by herself. She just hated the whole thing. Adie likes cheese.";

    const options = {
      method: 'POST', 
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify ({
        model: "gpt-3.5-turbo",
        messages: [{"role": "system", "content": "You are a summarizer."}, {role: "user", content: toSummarize}, ],
      })
    }
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', options);
      const data = await response.json();
      console.log(data.choices[0].message?.content); 
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <Box className='inputBox'>
            <TextField type="text" id="userInput" name="userInput"/>
            <Button type="submit" value="Submit" onClick={() => handleSubmit()}> Submit </Button>
        </Box>
      </header>
    </div>
  );
}

export default App;
