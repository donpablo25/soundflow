import "./navbar.css"
import logo from "../logo/SoundFlowLogoOnly.png"
//import { useNavigate, useLocation } from "react-router-dom"
import pfp from "./tyler.jpg"

import {useNavigate} from "react-router-dom"




export default function Navbar(){

    const navigate = useNavigate()

//    const location = useLocation()

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <img src={logo} alt="soundflow" className="nav-logo" onClick={()=>navigate("/list")}/>
                    <h3 className="title is-h3">Bon matin Jean  </h3>
                    <div className="circle-wrapper" onClick={()=>navigate("/profil")}>
                        <img src={pfp} alt="profile" />
                    </div>
                    
                </div>

                <div className="navbar-center">
                    <input className="input" type="text" placeholder="Search a song / artist" />
                </div>

                <div className="navbar-right">
                    <button className="button btnSF">Musique</button>
                    <button className="button btnSF">Upload</button>
                </div>
            </nav>
        
        </>
    )
}