import logo from './logo.svg';
import './App.css';
import IslamicSearch from './components/IslamicSearch';
import Bookmarks from './components/Bookmarks';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { useState } from 'react';


function getItemWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  console.log("itemStr:", itemStr)
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  const expires = new Date(item.expires);
  if (now > expires) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}


function App() {
  const [token, setToken] = useState(getItemWithExpiry('AHS_Token') || null)
  
  const handleToken = (newToken)=>{
      console.log("token updated:", newToken)
      setToken(newToken)
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<IslamicSearch token={token} updateToken={handleToken}/>} />
            <Route path="signin" element={<SignIn updateToken={handleToken}/>} />
            <Route path="signup" element={<SignUp updateToken={handleToken}/>} />
            <Route path="bookmarks" element={<Bookmarks token={token}/>} />
          </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
