import "./App.css";
import { useEffect, useState } from "react";
import {  useNavigate } from "react-router";
import { isUserAuthenticated } from "./core/services/auth.service";

function App() {
  if (import.meta.env.NODE_ENV === 'development') {
    console.log('Running in development mode');
  } else if (import.meta.env.NODE_ENV === 'production') {
    console.log('Running in production mode');
  }  
  const navigate = useNavigate();
  const [isAuthenticated] = useState(isUserAuthenticated())
  useEffect(() => {
    if(!isAuthenticated){
      navigate("/auth/login")
    } else {
      navigate("/main/home")
    }
  }, [isAuthenticated, navigate]);
  return (
    <>
    </>
  );
}

export default App;
