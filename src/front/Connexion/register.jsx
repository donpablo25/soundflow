import { useState } from "react"

//logo
import logo from "../logo/SoundFlow.png"


//icons
import { FcGoogle } from "react-icons/fc"; 
import { FaFacebook } from "react-icons/fa"; 
import { FaApple } from "react-icons/fa"

import { registerWithEmail, loginWithGoogle } from "../../back/auth";
import { Navigate, useNavigate } from "react-router-dom";

export default function Register({onSwitch}){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate()

    const handleRegister = async () =>{
  
        try{
            setError("")      
            const result = await registerWithEmail(email, password);
            const user = result.user
            navigate(`/profil/${user.uid}`);
        }catch(err){
            if (err.code === "auth/email-already-in-use"){
                setError("Cette adresse email est déjà utilisé par un autre utilisateur.")
            }else{
                setError("Une erreur est survenue")
            }
            console.error(err)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            
            const result = await loginWithGoogle();
            const user = result.user
            navigate(`/profil/${user.uid}`);
        } catch (err) {
            console.error(err);
        }
    };
    return(
        <>  

            <div className="loginContainer">

                <img src={logo} alt="Soundflow Logo" style={{ width: '150px', height: 'auto' }} />
                <h3 className="title is-3">Inscrivez-vous pour commecer à écouter</h3>

                <div className="field">
                    <label className="label">Adresse e-mail</label>
                    <input
                        className="input"
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                
                <div className="field">
                    <label className="label">Mot de passe</label>
                    <input
                        className="input"
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                <button className="button btnSF" onClick={handleRegister}>
                    Suivant
                </button>

                <p>ou</p>

                <div className="buttons-social-container">
                    <button
                        className="button btnSocial"
                        onClick={handleGoogleLogin}
                    >
                        <FcGoogle size={18} style={{ marginRight: "8px" }}/>
                        S'inscrire avec Google
                    </button>

                    <button
                        className="button btnSocial"
                    >
                        <FaFacebook size={18} style={{ marginRight: "8px" }}/>
                        S'inscrire avec Facebook
                    </button>                        

                    <button
                        className="button btnSocial"
                    >
                        <FaApple size={18} style={{ marginRight: "8px" }}/>
                        S'inscrire avec Apple
                    </button>
                </div>


                <p className="pas-compte"> 
                    Vous avez déjà un compte? {' '}
                </p>

                <button 
                        className="button btnSF"                                
                        onClick={onSwitch}
                    >
                        Se connecter
                </button>
    
            </div>

        </>
    )
}