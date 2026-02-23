import Swal from "sweetalert2";
import "./songEdit.css";
import Navbar from "../Navbar/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { subscribeToAuthChanges } from "../../back/auth";
import { updateSong, getSongById } from "../../back/firestore";

export default function SongEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        //
        const unsubscribe = subscribeToAuthChanges((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchSongData = async () => {
            try {
                //
                const songData = await getSongById(id);
                if (songData) {
                    setTitle(songData.titleSong || "");
                }
            } catch (error) {
                console.error("Erreur chargement chanson :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSongData();
    }, [id]);

    const handleUpdate = async () => {
        if (!title.trim() || !user) return;
        setIsSaving(true);
        try {
            //
            await updateSong(id, { titleSong: title });
            
            await Swal.fire({
                icon: "success",
                title: "Mise à jour réussie",
                background: "#1a1a1a",
                color: "#fff",
                confirmButtonColor: "#6E31DE"
            });
            navigate("/profil");
        } catch (error) {
            console.error("Erreur update song :", error);
            Swal.fire({
                icon: "error",
                title: "Problème!",
                text: "Un problème est survenu lors de la sauvegarde.",
                background: "#1a1a1a",
                color: "#fff"
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (!loading && !user) {
        return <div style={{color: "white"}}>Veuillez vous connecter pour modifier cette chanson.</div>;
    }

    return (
        <>
            <Navbar />
            <div className="modal-overlay">
                <div className="profile-card">
                    {loading ? (
                        <div className="loading" style={{color: "#fff", padding: "20px"}}>Chargement...</div>
                    ) : (
                        <>
                            <div className="profile-header">
                                <h2 className="modal-title">Modifier la chanson</h2>
                                <button 
                                    style={{ color: "#fff", cursor: "pointer" }} 
                                    className="close-btn" 
                                    onClick={() => navigate(-1)}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="edit">
                                <div className="field">
                                    <label className="label">Titre de la chanson</label>
                                    <input 
                                        className="input-field" 
                                        type="text" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn-cancel" onClick={() => navigate(-1)}>
                                    Annuler
                                </button>
                                <button 
                                    className="btn-save" 
                                    onClick={handleUpdate}
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Enregistrement..." : "Sauvegarder"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}