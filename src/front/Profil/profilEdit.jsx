import Navbar from "../Navbar/Navbar";
import "./profilEdit.css";
import Swal from "sweetalert2";
import { db } from "../../back/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { subscribeToAuthChanges, updateUserProfile } from "../../back/auth";

export default function ProfilEdit() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setUsername(currentUser.displayName || "");
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

        return () => {
            unsubscribe();
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]); 

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            if (preview) URL.revokeObjectURL(preview); 
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!user) return;
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
            navigate("/profil");
        } catch (error) {
            console.error("Erreur sauvegarde profil :", error);
            Swal.fire({
                icon: "error",
                title: "Problème!",
                text: "Un problème est survenu lors de la sauvegarde.",
                background: "#1a1a1a",
                color: "#fff"
            });
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
                        <div className="loading" style={{color: "#fff", padding: "20px"}}>Chargement...</div>
                    ) : (
                        <>
                            <div className="image-section">
                                <img 
                                    className="profile-avatar" 
                                    src={preview || user?.photoURL || "https://via.placeholder.com/150"} 
                                    alt="Avatar" 
                                />
                                <label htmlFor="file-upload" className="upload-link" style={{ cursor: "pointer" }}>
                                    Modifier la photo
                                </label>
                                <input
                                    id="file-upload" 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                />
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
                                    <textarea 
                                        className="textarea-field" 
                                        placeholder="Parlez-nous de vous..."
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn-cancel" onClick={() => navigate(-1)}>Annuler</button>
                                <button 
                                    className="btn-save"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
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