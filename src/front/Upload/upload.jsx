import { useState } from "react";
import "./upload.css";
import Navbar from "../Navbar/Navbar";

export default function Upload() {
    const [title, setTitle] = useState("");
    const [preview, setPreview] = useState(null);
    const [audioName, setAudioName] = useState("Aucun fichier sélectionné");

    // Gestion de l'image (Cover)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    // Gestion du MP3 (Nom du fichier)
    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudioName(file.name);
        }
    };

    return (
        <>
        <Navbar/>
        <div className="uploadContainer">


            <h3 className="title is-3 has-text-white has-text-centered">
                Déployez votre musique
            </h3>
                
            <div className="container" style={{ maxWidth: '450px' }}>
                
                <div className="field">
                    <label className="label has-text-white">Nom de la musique</label>
                    <div className="control">
                        <input
                            className="input custom-input"
                            placeholder="Titre de la musique"
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </div>

                <label className="label has-text-white mt-5">Téléverser votre cover (PNG, JPG)</label>
                <div className="cover-wrapper">
                    <label htmlFor="cover-input" className="cover-dropzone">
                        {preview ? (
                            <img src={preview} alt="Aperçu" className="cover-preview" />
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

                <label className="label has-text-white mt-5">Votre fichier (MP3, WAV)</label>
                <div className="file is-normal has-name is-fullwidth">
                    <label className="file-label">
                        <input 
                            className="file-input" 
                            type="file" 
                            accept="audio/*" 
                            onChange={handleAudioChange}
                        />
                        <span className="file-cta">
                            <span className="file-icon">
                                <i className="fas fa-upload"></i>
                            </span>
                            <span className="file-label">Choisir un titre</span>
                        </span>
                        <span className="file-name" style={{ color: 'white', backgroundColor: '#1a1a1a', borderColor: '#444' }}>
                            {audioName}
                        </span>
                    </label>
                </div>

                {/* BOUTON FINAL */}
                <button className="button btnSF is-fullwidth mt-6">
                    Confirmer le déploiement
                </button>

            </div>
        </div>
        </>
    );
}