import React, { useState } from 'react';
import './App.css';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Box, Button, TextField, Switch} from '@mui/material';
// import MaterialUISwitch from '../../components/switch/switch';

function App() {
  const [modeFlag, setModeFlag] = useState(true);
  const [displayText, setDisplayText] = useState("");


  const handleSubmit = async () => {
    //let toSummarize: string = "Addie had lived in Happyville since she was born. Next week, however, Addie and her family were moving over 1,000 miles away to Washington. Addie despised the idea of moving for many reasons. She was sad to be leaving her best friend. She had played on the soccer team for two years and didn’t want to leave her team. She would not be sleeping in her bedroom, which she loved and had decorated all by herself. She just hated the whole thing. Adie likes cheese.";
    console.log(process.env.REACT_APP_OPENAI_API_KEY)
    let toSummarize: string = (document.getElementById('userInput') as HTMLInputElement).value;
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
      setDisplayText(data.choices[0].message?.content);
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
      <div className='toggle-div'>
          <Switch  inputProps={{ 'aria-label': 'Switch Mode' }} onChange={() => changeMode()}/>
          {modeFlag && <DarkModeIcon fontSize='small'/>}
          {!modeFlag && <LightModeIcon fontSize='small'/>}
        </div>
        <header className="App-header">
        <Box className='inputLabelBox'>
          <p> Paste Text</p>
        </Box>
        <Box className='inputBox'>
            <TextField type="text" id="userInput" name="userInput"/>
            <div><Button type="submit" value="Submit" onClick={() => handleSubmit()}> Submit </Button></div>
        </Box>
        <p>{displayText}</p>
        </header>
      </div>
    </div>
  );
}

export default App;
