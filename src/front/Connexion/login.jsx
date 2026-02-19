import { useState } from "react";
import logo from "../logo/SoundFlow.png";
import { useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../../back/auth";

import { FcGoogle } from "react-icons/fc"; 

export default function Login({ onSwitch }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            setError("");
            await loginWithEmail(email, password);
            navigate("/profil");
        } catch (err) {
            setError("Identifiants invalides ou erreur de connexion.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate("/profil");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="loginContainer">
            <img src={logo} alt="Soundflow Logo" style={{ width: '150px', height: 'auto' }} />
            <h3 className="title is-3">Bon retour parmi nous</h3>

            {error && <p style={{ color: 'red' }}>{error}</p>}

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

            <button className="button btnSF" onClick={handleLogin}>
                Commencer
            </button>

            <p>ou</p>

            <div className="buttons-social-container">
                <button className="button btnSocial" onClick={handleGoogleLogin}>
                    <FcGoogle size={18} style={{ marginRight: "8px" }}/>
                    Continuer avec Google
                </button>
            </div>

            <p className="pas-compte">Vous n'avez pas de compte?</p>
            <button className="button btnSF" onClick={onSwitch}>
                S'inscrire
            </button>
        </div>
    );
}