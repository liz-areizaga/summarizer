import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import './App.css';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Box, Button, TextField, Switch} from '@mui/material';
import CircularColor from './components/Loading/Loading';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

function App() {
  const [modeFlag, setModeFlag] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInput,setUserInput] = useState("");
  const [alignment, setAlignment] = React.useState<string | null>('left');

  function getYouTubeVideoIdByUrl(url: string): string{
    const reg = /^(https?:)?(\/\/)?((www\.|m\.)?youtube(-nocookie)?\.com\/((watch)?\?(feature=\w*&)?vi?=|embed\/|vi?\/|e\/)|youtu.be\/)([\w\-]{10,20})/i
    const match = url.match(reg);
    if (match) {
        return match[9];
    } else {
        return "";
    }
  }

  const handleLink = async () => {
    let link: string = (document.getElementById('userLink') as HTMLInputElement).value;
    let videoID: string = getYouTubeVideoIdByUrl(link);
    let returnedTranscript: string = "";
    if (videoID === "") {
      alert("No Video ID found");
      return;
    } else {
      try{
        const response = await axios.get("/data", {
          params: {
            id: videoID
          }
        });  
        returnedTranscript = response.data;
      }
      catch(error){
        alert(error);
        throw error;
      }
    }
    return returnedTranscript;
  } 

  const handleSubmit = async () => {
    let toSummarize;
    if (alignment === 'right') { 
      try {
        toSummarize = await handleLink(); // Wait for the asynchronous operation to complete
        } catch (error) {
        alert(error);
        return;
      }
    } else { 
      toSummarize = "Give me a summary: " +  (document.getElementById('userInput') as HTMLInputElement).value;
    } const options = {
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
        <div className='inputBox'>
            <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
            >
                <ToggleButton value="left" aria-label="text" size='small'>
                  {!modeFlag && <ContentPasteIcon sx={{color: "#F5F5F5"}}/>}
                  {modeFlag && <ContentPasteIcon/>}
                </ToggleButton>
                <ToggleButton value="right" aria-label="link" size='small'>
                  {!modeFlag && <YouTubeIcon sx={{color: "#F5F5F5"}}/>}
                  {modeFlag && <YouTubeIcon/>}
                </ToggleButton>
            </ToggleButtonGroup>
            <Box sx={{ width: 800, maxWidth: '100%', mt: 1}}>
              {modeFlag && !(alignment === 'right') && <TextField  inputProps = {{style: {color: "black"}}} fullWidth type="text" id="userInput" label='Text to Summarize' name="userInput" multiline rows={4}  value = {userInput} onChange = {handleInputChange}/>}
              {!modeFlag && !(alignment === 'right') && <TextField  inputProps = {{style: {color: "white"}}} fullWidth type="text" id="userInput" label='Text to Summarize' name="userInput" multiline rows={4} value = {userInput} onChange = {handleInputChange} focused/>}
              {modeFlag && (alignment === 'right') && <TextField  inputProps = {{style: {color: "black"}}} fullWidth type="text" id="userLink" label='Youtube Link' name="userLink" multiline rows={4}  value = {userInput} onChange = {handleInputChange}/>}
              {!modeFlag && (alignment === 'right') && <TextField  inputProps = {{style: {color: "white"}}} fullWidth type="text" id="userLink" label='Youtube Link' name="userLink" multiline rows={4} value = {userInput} onChange = {handleInputChange} focused/>}
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
