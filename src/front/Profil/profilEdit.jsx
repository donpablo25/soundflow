import Navbar from "../Navbar/navbar";
import "./profilEdit.css";
import Swal from "sweetalert2";
import { db } from "../../back/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { subscribeToAuthChanges, updateUserProfile, isUsernameTaken } from "../../back/auth";
import { FaUser, FaEnvelope, FaLock, FaCheck, FaExclamationTriangle } from "react-icons/fa";

export default function ProfilEdit() {
    const [user, setUser] = useState(null);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [mdp, setMdp] = useState("");
    const [bio, setBio] = useState("");

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    
    const [isAvailable, setIsAvailable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    const navigate = useNavigate();

    const isEmailValid = email.includes("@") && email.includes(".");
    const isUsernameValid = username.length >= 3;

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setUsername(currentUser.displayName || "");
                setEmail(currentUser.email || "");
                try {
                    const userDocRef = doc(db, "users", currentUser.uid); 
                    const userSnap = await getDoc(userDocRef);
                    if (userSnap.exists()) {
                        setBio(userSnap.data().bio || "");
                    }
                } catch (error) {
                    console.error("Erreur récupération profil Firestore :", error);
                }
            }
            setFetching(false);
        });

        return () => unsubscribe();
    }, []);

    const checkUsername = async (val) => {
        setUsername(val);
        if (val.length >= 3 && val !== user?.displayName) {
            const taken = await isUsernameTaken(val);
            setIsAvailable(!taken);
        } else {
            setIsAvailable(true);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            if (preview) URL.revokeObjectURL(preview); 
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!user || !isAvailable) return;
        setLoading(true);
        try {
            await updateUserProfile(user, {
                username,
                photoFile: imageFile, 
                currentPhotoURL: user.photoURL,
                bio
            });

            await Swal.fire({
                icon: "success",
                title: "Mise à jour réussie",
                background: "#1a1a1a",
                color: "#fff",
                confirmButtonColor: "#6E31DE"
            });
            
            navigate(`/profil/${user?.uid}`);
        } catch (error) {
            console.error("Erreur sauvegarde profil :", error);
            Swal.fire({ icon: "error", title: "Problème!", text: "Erreur lors de la sauvegarde.", background: "#1a1a1a", color: "#fff" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar /> 
            <div className="modal-overlay">
                <div className="profile-card">
                    <div className="profile-header">
                        <h2 className="modal-title">Mon Profil</h2>
                        <button className="close-btn" onClick={() => navigate(-1)}>✕</button>
                    </div>

                    {fetching ? (
                        <div className="loading" style={{color: "#fff", padding: "20px", textAlign: "center"}}>Chargement...</div>
                    ) : (
                        <>
                            <div className="image-section">
                                <img className="profile-avatar" src={preview || user?.photoURL || "https://via.placeholder.com/150"} alt="Avatar" />
                                <label htmlFor="file-upload" className="upload-link">Modifier la photo</label>
                                <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                            </div>

                            <div className="edit">
                                <div className="field">
                                    <label className="label">Nom d'utilisateur</label>
                                    <div className="control has-icons-left has-icons-right">
                                        <input className={`input-field ${username ? (isUsernameValid && isAvailable ? "is-success" : "is-danger") : ""}`} 
                                               type="text" value={username} onChange={(e) => checkUsername(e.target.value)} />
                                        <span className="icon is-small is-left"><FaUser /></span>
                                        {username && (
                                            <span className="icon is-small is-right">
                                                {isUsernameValid && isAvailable ? <FaCheck color="green"/> : <FaExclamationTriangle color="red"/>}
                                            </span>
                                        )}
                                    </div>
                                    {username && !isAvailable && <p className="help is-danger">Ce nom d'utilisateur est déjà pris.</p>}
                                </div>

                                <div className="field">
                                    <label className="label">Adresse courriel</label>
                                    
                                    <div className="control has-icons-left has-icons-right">
                                            <span className="icon is-small is-left"><FaEnvelope /></span>
                                        <input className={`input-field ${email ? (isEmailValid ? "is-success" : "is-danger") : ""}`} 
                                               type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    
                                    </div>
                                </div>


                                <div className="field">
                                    <label className="label">Nouveau mot de passe</label>
                                    <div className="control has-icons-left">
                                        <input className="input-field" type="password" placeholder="Laissez vide pour ne pas changer" 
                                               value={mdp} onChange={(e) => setMdp(e.target.value)} />
                                        <span className="icon is-small is-left"><FaLock /></span>
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">Biographie</label>
                                    <textarea className="textarea-field" value={bio} onChange={(e) => setBio(e.target.value)} />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn-cancel" onClick={() => navigate(-1)}>Annuler</button>
                                <button className="btn-save" onClick={handleSave} disabled={loading || !isAvailable}>
                                    {loading ? "Sauvegarde..." : "Sauvegarder"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}