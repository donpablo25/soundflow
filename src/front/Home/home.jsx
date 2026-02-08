import logo from "../logo/SoundFlow.png";
export default function Home(){

    return(
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

