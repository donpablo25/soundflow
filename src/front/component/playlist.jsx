import { useState, useEffect } from "react";
import { avoirArticle } from "../../back/firestore";
import MusicPlayer from "./mpFooter";
import "./playlist.css"
export default function PlaylistPage() {
    const [songs, setSongs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const data = await avoirArticle();
                setSongs(data);
            } catch (error) {
                console.error("Erreur chargement playlist:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSongs();
    }, []);

/*
        const onPlaying = () => {
        const duration = audioRef.current.duration;
        const ct = audioRef.current.currentTime;
        setCurrentTime(ct)
        setProgress((ct / duration) * 100);
    };

*/



    const nextSong = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.length);
    };

    const prevSong = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
    };

    if (loading) return <p>Chargement de la playlist...</p>;
    if (songs.length === 0) return <p>Aucune musique trouvée.</p>;

    return (
        <div className="playlist-container">

            <div className="song-list">

                <div className="description subtitle">
                    Vos favoris
                </div>
                {songs.map((s, index) => (
                    <div 
                        key={s.id} 
                        className={`song-item ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    >
                        <img src={s.coverUrl} alt={s.titleSong} style={{width: '50px'}} />
                        <p>{s.titleSong}</p>
                  
                    </div>
                ))}
            </div>
        </div>
    );
}