import { useState } from "react"

//logo
import logo from "../logo/SoundFlow_Logo_-removebg-preview.png"


//icons
import { FcGoogle } from "react-icons/fc"; 
import { FaFacebook } from "react-icons/fa"; 
import { FaApple } from "react-icons/fa"

export default function Login({onSwitch}){

    const [email, setEmail] = useState("")

    return(
        <>  
            <div className="loginContainer">

                <div className="logo-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img 
                        src={logo} 
                        alt="Soundflow Logo" 
                        style={{ width: '150px', height: 'auto' }} 
                    />
                </div>

                <h3 className="title is-3">
                    Bon retour parmi nous
                </h3>

                <div className="container">
                        <div className="inputs">
                            <label className="label">
                                Adresse e-mail ou nom d'utilisateur
                            </label>
                            <input
                            className="input"
                            placeholder="nom@email.com"
                            type="text" 
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            />

                        </div>
                        
                        <button className="button btnSF">
                            Commencer
                        </button>

                        <p>ou</p>

                        <div className="buttons-social-container">
                            <button
                                className="button btnSocial"
                            >
                                <FcGoogle size={18} style={{ marginRight: "8px" }}/>
                                Continuer avec Google
                            </button>

                            <button
                                className="button btnSocial"
                            >
                                <FaFacebook size={18} style={{ marginRight: "8px" }}/>
                                Continuer avec Facebook
                            </button>                        

                            <button
                                className="button btnSocial"
                            >
                                <FaApple size={18} style={{ marginRight: "8px" }}/>
                                Continuer avec Apple
                            </button>
                        </div>

                        <p className="pas-compte"> 
                            Vous n'avez pas de compte? {' '}
                        </p>

                        <button 
                                className="button btnSF"                                
                                onClick={onSwitch}
                            >
                                S'inscrire
                        </button>
                        
                    </div>
                </div>

        </>
    )
}