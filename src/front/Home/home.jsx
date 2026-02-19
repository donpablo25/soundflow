import logo from "../logo/SoundFlow.png";
import "./home.css"


import { useNavigate } from "react-router-dom";
export default function Home(){

    const navigate = useNavigate()

    return(
        <>
            <nav className="navbar-home">
                <div className="navbar-left">
                    <img src={logo} alt="soundflow" className="nav-logo-home" />
                </div>

                <div className="navbar-right">
                    <button className="button" onClick={(()=>navigate("/connection", {state:{mode:"login"}}))}>Me connecter?</button>
                    <button className="button btnSF" onClick={(()=>navigate("/connection", {state:{mode:"signup"}}))} >S'incrire</button>
                </div>
            </nav>

            <div className="hero-section">
                <div className="hero-content">
                    <h6 className="subtitle is-6">
                        VIVEZ VOTRE PASSION
                    </h6>
                 
                    <h1 className="title is-1">
                        Accessible <br /> 
                        Indépendant <br /> 
                        Communautaire
                    </h1>
                    <br />
                    <h5 className="subtitle is-5">
                        Découvrez des talents émergents exclusifs et partagez
                        vos création sans aucune barrière technique
                    </h5>        
                    <br />
                    <button className="button btnSF"> Commencer</button>
                
                </div>
            </div>

            <div className="footer">
                <p>Le choix privilège des artistes indépendants et des <br />
                créateurs de la relève musicale</p>
            </div>
        </>
    )
}

