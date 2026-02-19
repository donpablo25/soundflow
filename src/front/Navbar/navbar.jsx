import "./navbar.css"
import logo from "../logo/SoundFlowLogoOnly.png"
import { subscribeToAuthChanges } from "../../back/auth"


import {useNavigate} from "react-router-dom"
import { useEffect, useState } from "react"
import { logout } from "../../back/auth"

export default function Navbar(){
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect (()=>{
        const unsubcribe = subscribeToAuthChanges((currentUser)=>{
            setUser(currentUser)
        })
        return () => unsubcribe()
    },[])

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <img src={logo} alt="soundflow" className="nav-logo" onClick={()=>navigate("/list")}/>
                    <button className="button btnSF">Musique</button>
                    <button className="button btnSF">Upload</button>                
                </div>

                <div className="navbar-center">
                    <div className="circle-wrapper" onClick={()=>navigate("/profil")}>
                        <img src={ user?.photoURL } alt="pfpUser" />
                    </div>
                </div>

                <div className="navbar-right">

                    <button className="button is-danger" onClick={logout}>Déconnexion</button>
                </div>
            </nav>
        
        </>
    )
}