import { useState } from "react"
import { FaUser, FaEnvelope, FaLock, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"; 
import logo from "../logo/SoundFlow.png"
import { registerWithEmail, loginWithGoogle, isUsernameTaken } from "../../back/auth";
import { useNavigate } from "react-router-dom";

export default function Register({onSwitch}){
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [isAvailable, setIsAvailable] = useState(null)

    const navigate = useNavigate()

    const isEmailValid = email.includes("@") && email.includes(".");
    const isUsernameValid = username.length >= 3;


    const checkUsername = async (val) =>{
        setUsername(val)
        if(val.length>=3){
            const taken = await isUsernameTaken(val)
            setIsAvailable(!taken)
        }else{
            setIsAvailable(null)
        }
    }

    const handleRegister = async () =>{
        if (!isAvailable){
            setError("Ce nom d'utilisateur n'est pas disponible")
            return
        }
        try{
            setError("")      
            const result = await registerWithEmail(email, password, username);
            const user = result.user
            navigate(`/profil/${user.uid}`);
        }catch(err){
            if (err.code === "auth/email-already-in-use"){
                setError("Cette adresse email est déjà utilisée.")
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
        <div className="loginContainer">
            <img src={logo} alt="Soundflow Logo" style={{ width: '150px', height: 'auto' }} />
            <h3 className="title is-3">Inscrivez-vous pour commencer à écouter</h3>

            {error && <p className="help is-danger" style={{ fontSize: '1rem', marginBottom: '10px' }}>{error}</p>}

            <div className="field">
                <label className="label">Adresse e-mail</label>
                <div className="control has-icons-left has-icons-right">
                    <input
                        className={`input ${email ? (isEmailValid ? "is-success" : "is-danger") : ""}`}
                        type="email" 
                        placeholder="nom@mail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                        <FaEnvelope />
                    </span>
                    {email && (
                        <span className="icon is-small is-right">
                            {isEmailValid ? <FaCheck color="green"/> : <FaExclamationTriangle color="red"/>}
                        </span>
                    )}
                </div>
                {email && !isEmailValid && <p className="help is-danger">L'adresse email est invalide</p>}
            </div>

            <div className="field">
                <label className="label">Username</label>
                <div className="control has-icons-left has-icons-right">
                    <input
                        className={`input ${username ? (isUsernameValid ? "is-success" : "is-danger") : ""}`}
                        type="text" 
                        placeholder="Votre username"
                        value={username}
                        onChange={(e) => checkUsername(e.target.value)}
                    />

                    <span className="icon is-small is-left">
                        <FaUser />
                    </span>
                    {username && (
                        <span className="icon is-small is-right">
                            {isUsernameValid ? <FaCheck color="green"/> : <FaExclamationTriangle color="red"/>}
                        </span>
                    )}
                </div>
                {username && (
                    <p className={`help ${isUsernameValid ? "is-success" : "is-danger"}`}>
                        {isUsernameValid ? "Nom d'utilisateur disponible" : "Trop court (min. 3 caractères)"}
                    </p>
                )}
            </div>

            <div className="field">
                <label className="label">Mot de passe</label>
                <div className="control has-icons-left">
                    <input
                        className="input"
                        type="password" 
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                        <FaLock />
                    </span>
                </div>
            </div>
            
            <button className="button btnSF is-fullwidth" onClick={handleRegister}>
                Suivant
            </button>

            <p style={{ textAlign: 'center', margin: '15px 0' }}>ou</p>

            <div className="buttons-social-container">
                <button className="button btnSocial is-fullwidth" onClick={handleGoogleLogin}>
                    <FcGoogle size={18} style={{ marginRight: "8px" }}/>
                    S'inscrire avec Google
                </button>
            </div>

            <p className="pas-compte" style={{ marginTop: '20px', textAlign: 'center' }}> 
                Vous avez déjà un compte ?
            </p>

            <button className="button btnSF" onClick={onSwitch}>
                Se connecter
            </button>
        </div>
    )
}