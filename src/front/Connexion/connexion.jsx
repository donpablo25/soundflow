import { useState } from "react";
import Login from "./login";
import Register from "./register";
import "./connexion.css"
export default function Connexion(){

    const [isLogin, setIsLogin] = useState(true)

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