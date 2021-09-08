import { useState } from 'react';
import ReactInterval from 'react-interval';
import TextTransition, { presets } from "react-text-transition";

function timeStatus(s) {
  let ms = s % 1000;
  s = (s - ms) / 1000;
  let secs = s % 60;
  s = (s - secs) / 60;
  let mins = s % 60;
  let hrs = (s - mins) / 60;
  if (hrs > 0) {
      return hrs + ' hours ago';
  }
  else if (mins > 0) {
      return mins + ' min ago';
  }
  else if (secs > 0) {
      return secs + ' sec ago';
  }
  else {
      return 'Just now';
  }
}

export default function TimeStatus({ latestTime }) {
    
    const [refreshState, setRefreshState] = useState(false);
    return (
        <>
            <TextTransition inline text={timeStatus(new Date() - latestTime)} springConfig={ presets.gentle } />
            <ReactInterval timeout={5000} enabled={true}
            callback={() => setRefreshState(!refreshState)}
            />
        </>
    )
}