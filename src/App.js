import React, { useState, useRef, useEffect } from 'react'
import './App.css';

const App = () => {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const myAudio = useRef();

  const handleSwitch = () => {
    if (timerLabel === 'Session') {
      setTimerLabel('Break');
      setSecondsLeft(breakLength * 60);
    } else if (timerLabel === 'Break') {
      setTimerLabel('Session');
      setSecondsLeft(sessionLength * 60);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerRunning && secondsLeft >= 0) setSecondsLeft(secondsLeft - 1);
    }, 1000);
    
    if (timerRunning && secondsLeft === 0) {
      myAudio.current.play();
      handleSwitch();
    }
    return () => clearInterval(interval);
},[timerRunning, secondsLeft, timerLabel, breakLength, sessionLength, myAudio]);
    
  const incrementSession = () => {
    if (!timerRunning && sessionLength < 60){
      setSessionLength(sessionLength + 1)
      setSecondsLeft((sessionLength + 1) * 60);
    }
  }

  const decrementSession = () => {
    if (!timerRunning && sessionLength > 1) {
      setSessionLength(sessionLength - 1)
      setSecondsLeft((sessionLength - 1) * 60);
    }
  }

  const incrementBreak = () => {
    if (!timerRunning && breakLength < 60){
      setBreakLength(breakLength + 1)
    }
  }

  const decrementBreak = () => {
     if (!timerRunning && breakLength > 1) {
      setBreakLength(breakLength - 1)
    }
  }
    
  const handleStart = () => {
    setTimerRunning(true);
  }
    
  const handlePause = () => {
    setTimerRunning(false);
  }
    
  const handleReset = () => {
    setSessionLength(25);
    setBreakLength(5);
    setSecondsLeft(25 * 60);
    setTimerLabel('Session');
    setTimerRunning(false);
    myAudio.current.pause();
    myAudio.current.currentTime = 0;
  }

  const toMMSS = () => {
    let minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;

    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  };

  let toggleStartPause = timerRunning ?
    <button id='start_stop'  onClick={handlePause}>Pause</button> :
    <button id='start_stop'  onClick={handleStart}>Start</button>
  

  return (
    <div className='App'>
      <h2>25 + 5 clock</h2>
      <div className='break-session'>
        <div className='break'>
          <p id='break-label'>Break Length</p>
          <div className='buttons'>
            <button id='break-increment' onClick={incrementBreak}>+</button>
            <span id="break-length">{breakLength}</span>
            <button id='break-decrement' onClick={decrementBreak}>-</button>
          </div>
        </div>
        <div className='session'>
          <p id='session-label'>Session Length</p>
          <div className='buttons'>
            <button id='session-increment' onClick={incrementSession}>+</button>
            <span id="session-length">{sessionLength}</span>
            <button id='session-decrement' onClick={decrementSession}>-</button>
          </div>
        </div> 
      </div>
      <div className='session-main'>
        <p id='timer-label'>{timerLabel}</p>
        <p id='time-left'>{toMMSS(secondsLeft)}</p>
        <div className='start-reset'>
          {toggleStartPause}
          <button id='reset' onClick={handleReset}>Reset</button>
        </div>
      </div> 
      <audio
          id="beep"
          preload="auto"
          ref={myAudio} 
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
    </div>);
}

export default App;