import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc"; 
import logo from "../logo/SoundFlow.png";
import { useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../../back/auth";

export default function Login({ onSwitch }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            setError("");
            const result = await loginWithEmail(email, password);
            const user = result.user;
            navigate(`/profil/${user.uid}`);
        } catch (err) {
            setError("Identifiants invalides ou erreur de connexion.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await loginWithGoogle();
            const user = result.user;
            navigate(`/profil/${user.uid}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="loginContainer">
            <img src={logo} alt="Soundflow Logo" style={{ width: '150px', height: 'auto', marginBottom: '20px' }} />
            <h3 className="title is-3">Bon retour parmi nous</h3>

            {error && <p className="help is-danger" style={{ textAlign: 'center', marginBottom: '10px' }}>{error}</p>}

            <div className="field">
                <label className="label">Adresse e-mail</label>
                <div className="control has-icons-left">
                    <input
                        className="input"
                        type="email" 
                        placeholder="nom@mail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                        <FaEnvelope />
                    </span>
                </div>
            </div>

            <div className="field">
                <label className="label">Mot de passe</label>
                <div className="control has-icons-left">
                    <input
                        className="input"
                        type="password" 
                        placeholder="••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                        <FaLock />
                    </span>
                </div>
            </div>

            <button className="button btnSF is-fullwidth" onClick={handleLogin}>
                Commencer
            </button>

            <p style={{ margin: '15px 0' }}>ou</p>

            <div className="buttons-social-container">
                <button className="button btnSocial is-fullwidth" onClick={handleGoogleLogin}>
                    <FcGoogle size={18} style={{ marginRight: "8px" }}/>
                    Continuer avec Google
                </button>
            </div>

            <p className="pas-compte" style={{ marginTop: '20px' }}>Vous n'avez pas de compte ?</p>
            <button className="button btnSF" onClick={onSwitch}>
                S'inscrire
            </button>
        </div>
    );
}