import Navbar from "../Navbar/navbar"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { subscribeToAuthChanges } from "../../back/auth"
import "./profilEdit.css"


export default function ProfilEdit(){
    const {id} = useParams();
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const unsubcribe = subscribeToAuthChanges((currentUser) => {
            setUser(currentUser)
            if (currentUser) {
                setUsername(currentUser.displayName || "")
            }
        })
        return () => unsubcribe()
    }, [])

    return (
        <>
            <Navbar/> 
            <div className="modal-overlay">
                <div className="profile-card">
                    <div className="profile-header">
                        <h2 className="modal-title">Mon Profil</h2>
                        <button className="close-btn" onClick={() => navigate(-1)}>✕</button>
                    </div>

                    <div className="image-section">
                            <img className="profile-avatar" src={user?.photoURL} alt="pfpUser" />
                            <button className="upload-link">Upload</button>
                    </div>

                    <div className="edit">
                        <div className="field">
                            <label className="label">Username</label>
                            <input 
                                className="input-field" 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label className="label">Biographie</label>
                            <textarea className="textarea-field" placeholder="Parlez-nous de vous..."></textarea>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn-cancel" onClick={() => navigate(-1)}>Annulez</button>
                        <button className="btn-save">Sauvegarder</button>
                    </div>
                </div>
            </div>
        </>
    )
}