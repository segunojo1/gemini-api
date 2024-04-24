import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import gemini from './gemini';

function App() {
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
  }, [])

  const makeRequest = async () => {
    try {
      console.log('hii');
      const {data} = await gemini.post("/gemini-pro:generateContent", {"contents":[{"parts":[{"text": query}]}]})
      setAnswer(data.candidates[0].content.parts[0].text);
      console.log(data);
      console.log('done');
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}/>
      <button onClick={makeRequest}>Send</button>
      <div className="answer">
        <p>{answer}</p>
      </div>
    </>
  )
}

export default App
