
import "./navbar.css"
import logo from "../logo/SoundFlow_Logo_-removebg-preview.png";

//import { useNavigate, useLocation } from "react-router-dom"


export default function Navbar(){

//    const navigate = useNavigate()

//    const location = useLocation()


    
    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <img src={logo} alt="soundflow" className="nav-logo" />
                </div>

                <div className="navbar-right">
                    <button className="button btnSF">Publier?</button>
                    <button className="button btn-logout">Déconnexion</button>
                </div>
            </nav>
        
        </>
    )
}