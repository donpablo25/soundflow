import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Login from "./login";
import Register from "./register";
import "./connexion.css"


export default function Connexion(){

    const location = useLocation()
    const [isLogin, setIsLogin] = useState(true)

    useEffect(()=>{
        if(location.state?.mode === "signup"){
            setIsLogin(false)
        }else{
            setIsLogin(true)
        }
    },[location.state])

    return(
        <>
            {isLogin ? (
                <Login onSwitch={()=> setIsLogin(false)} />
            ) : (
                <Register onSwitch={() => setIsLogin(true)}/>
            )}

        </>
    )
}