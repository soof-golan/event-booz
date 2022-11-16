import './App.css'
import Header from "./components/Header";
import Explanation from "./components/Explanation";
import RegistrationForm from "./components/RegistrationForm";
import FormClosed from "./components/FormClosed";
import {closingTime} from "./consts";
import {useEffect, useState} from "react";

export const App = () => {
  const isClosed = () => Date.now() > closingTime;
  const [closed, setClosed] = useState(isClosed())

  useEffect(() => {
    if (!closed) {
      const handle = setTimeout(() => {
        setClosed(isClosed())
      }, closingTime - Date.now());
      return () => clearTimeout(handle);
    }
  }, [])

  return <div className="App">
    <Header/>
    <br/>
    <Explanation/>
    <br/>
    {closed ? <FormClosed/> : <RegistrationForm/>}
  </div>;
};

export default App
