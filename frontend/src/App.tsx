import React, { useState } from 'react';
import './App.css';
import { Box, Button, TextField, InputLabel, Switch, Typography} from '@mui/material';
// import MaterialUISwitch from '../../components/switch/switch';

function App() {
  const [modeFlag, setModeFlag] = useState(true);


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

  const changeMode = async() => {
    if(modeFlag === true) { //If light mode, change to dark mode
      const content = document.getElementsByClassName("light-mode");
      content[0].className = "dark-mode";
    } 
    else { //If dark mode, change to light mode
      const content = document.getElementsByClassName("dark-mode");
        content[0].classList.replace("dark-mode","light-mode");
    }
    setModeFlag(!modeFlag);
  }
  
    return (
    <div className="light-mode">
      <div className="App">
        <header className="App-header">
        <Switch inputProps={{ 'aria-label': 'Switch Mode' }} onChange={() => changeMode()}/>
        <Typography>Change Mode</Typography> 

        <Box className='inputLabelBox'>
          <p> Paste Text</p>
          {/* <InputLabel className="inputLabel">Please paste in your text</InputLabel> */}
        </Box>
        <Box className='inputBox'>
            <TextField type="text" id="userInput" name="userInput"/>
            <div><Button type="submit" value="Submit" onClick={() => handleSubmit()}> Submit </Button></div>
        </Box>
        </header>
      </div>
    </div>
  );
}

export default App;
