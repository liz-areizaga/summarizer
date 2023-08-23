import React, { useEffect, useState, ChangeEvent } from 'react';
import './App.css';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Box, Button, TextField, Switch} from '@mui/material';
import CircularColor from './components/Loading/Loading';
import Navbar from './components/Navbar/Navbar'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

function App() {
  const [modeFlag, setModeFlag] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInput,setUserInput] = useState("");
  const [transcript, setTranscript] = useState("");
  const [alignment, setAlignment] = React.useState<string | null>('left');

useEffect(() => {
  // Using fetch to fetch the api from
  // flask server it will be redirected to proxy
  fetch("/data").then((res) =>
      res.json().then((data) => {
          // Setting a data from api
          console.log(data);
          setTranscript(data.Transcript)
      })
  );
}, []);


  const handleSubmit = async () => {
    //let toSummarize: string = "Addie had lived in Happyville since she was born. Next week, however, Addie and her family were moving over 1,000 miles away to Washington. Addie despised the idea of moving for many reasons. She was sad to be leaving her best friend. She had played on the soccer team for two years and didn’t want to leave her team. She would not be sleeping in her bedroom, which she loved and had decorated all by herself. She just hated the whole thing. Adie likes cheese.";
    let toSummarize: string = "Give me a summary: " + (document.getElementById('userInput') as HTMLInputElement).value;
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
      setIsLoading(true);
      const response = await fetch('https://api.openai.com/v1/chat/completions', options);
      const data = await response.json();
      console.log(data.choices[0].message?.content); 
      setDisplayText(data.choices[0].message?.content);
      setIsLoading(false);
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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value)
  }

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
    ) => {
      if (newAlignment !== null) {
        setAlignment(newAlignment);
      }
  };
  
    return (

    <div className="light-mode">
      <div className="App">
        
        <div className='header'>
          {/* <div className = 'navBar'><Navbar/></div> */}
          <div className='toggle-div'>
            <Switch  inputProps={{ 'aria-label': 'Switch Mode' }} onChange={() => changeMode()}/>
            {modeFlag && <DarkModeIcon fontSize='small'/>}
            {!modeFlag && <LightModeIcon fontSize='small'/>}
          </div>
        </div>
        <header className="App-header">
        {modeFlag && <img src="SummarizerBlack.png" width="200" height="200" alt = "Light mode logo"/>}
        {!modeFlag && <img src="SummarizerWhite.png" width="200" height="200" alt = "Dark mode logo"/>}
        <p></p>
        {/* <p> {transcript}</p> */}
        <div className='inputBox'>
            <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
            >
                <ToggleButton value="left" aria-label="text" size='small'>
                  <ContentPasteIcon/>
                </ToggleButton>
                <ToggleButton value="right" aria-label="link" size='small'>
                  <YouTubeIcon/>
                </ToggleButton>
            </ToggleButtonGroup>
            <Box sx={{ width: 800, maxWidth: '100%', mt: 1}}>
              {modeFlag && !(alignment === 'right') && <TextField  inputProps = {{style: {color: "black"}}} fullWidth type="text" id="userInput" label='Text to Summarize' name="userInput" multiline rows={4}  value = {userInput} onChange = {handleInputChange}/>}
              {!modeFlag && !(alignment === 'right') && <TextField  inputProps = {{style: {color: "white"}}} fullWidth type="text" id="userInput" label='Text to Summarize' name="userInput" multiline rows={4} value = {userInput} onChange = {handleInputChange} focused/>}
              {modeFlag && (alignment === 'right') && <TextField  inputProps = {{style: {color: "black"}}} fullWidth type="text" id="userInput" label='Youtube Link' name="userInput" multiline rows={4}  value = {userInput} onChange = {handleInputChange}/>}
              {!modeFlag && (alignment === 'right') && <TextField  inputProps = {{style: {color: "white"}}} fullWidth type="text" id="userInput" label='Youtube Link' name="userInput" multiline rows={4} value = {userInput} onChange = {handleInputChange} focused/>}
              {/* {!modeFlag && } */}
            </Box>
            <div className='submit-button'><Button type="submit" value="Submit" onClick={() => handleSubmit()}> Submit </Button></div>
        </div>
        <div className='summary-div'>
          {isLoading ? (
            <CircularColor/> 
          ) : (
            <p className = "text-display">{displayText}</p>
          )}
        </div>
        </header>
      </div>
    </div>
  );
}

export default App;
