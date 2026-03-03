import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


import Navbar from "../Navbar/Navbar";
import { subscribeToAuthChanges } from "../../back/auth";
import { updateSong, getSongById } from "../../back/firestore";

import "./songEdit.css";

export default function SongEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [title, setTitle] = useState("");
    const [preview, setPreview] = useState(null); 
    const [coverFile, setCoverFile] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);


    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchSongData = async () => {
            try {
                const songData = await getSongById(id);
                if (songData) {
                    setTitle(songData.titleSong || "");
                    if (songData.coverUrl) {
                        setPreview(songData.coverUrl); 
                    }
                }
            } catch (error) {
                console.error("Erreur lors du chargement :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSongData();
    }, [id]);

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async () => {
        if (!title.trim() || !user) return;

        setIsSaving(true);
        try {
            await updateSong(id, { 
                titleSong: title,
                coverFile: coverFile 
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
            console.error("Erreur update song :", error);
            Swal.fire({
                icon: "error",
                title: "Oups !",
                text: "Une erreur est survenue lors de la sauvegarde.",
                background: "#1a1a1a",
                color: "#fff"
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (!loading && !user) {
        return (
            <div className="error-container" style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
                <p>Veuillez vous connecter pour modifier cette chanson.</p>
                <button onClick={() => navigate("/login")}>Se connecter</button>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="modal-overlay">
                <div className="profile-card">
                    {loading ? (
                        <div className="loading" style={{ color: "#fff", padding: "20px", textAlign: "center" }}>
                            Chargement des données...
                        </div>
                    ) : (
                        <>
                            <div className="profile-header">
                                <h2 className="modal-title">Modifier la chanson</h2>
                                <button 
                                    className="close-btn" 
                                    onClick={() => navigate(-1)}
                                    aria-label="Fermer"
                                >
                                    ✕
                                </button>
                            </div>

                            <label className="label has-text-white mt-5">Pochette de l'album (PNG, JPG)</label>
                            <div className="cover-wrapper">
                                <label htmlFor="cover-input" className="cover-dropzone">
                                    {preview ? (
                                        <img src={preview} alt="Aperçu pochette" className="cover-preview" />
                                    ) : (
                                        <div className="placeholder">
                                            <span className="icon is-large">
                                                <i className="fas fa-2x fa-image"></i>
                                            </span>
                                            <p>Ajouter une pochette</p>
                                        </div>
                                    )}
                                </label>
                                <input
                                    id="cover-input"
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                />
                            </div>

                            <div className="edit">
                                <div className="field">
                                    <label className="label">Titre de la chanson</label>
                                    <input 
                                        className="input-field" 
                                        type="text" 
                                        placeholder="Ex: Ma superbe musique"
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button 
                                    className="btn-cancel" 
                                    onClick={() => navigate(-1)}
                                    disabled={isSaving}
                                >
                                    Annuler
                                </button>
                                <button 
                                    className="btn-save" 
                                    onClick={handleUpdate}
                                    disabled={isSaving || !title.trim()}
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