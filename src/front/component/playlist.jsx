import FavoriteIcon from '@mui/icons-material/Favorite';
import { doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../back/firebase"; 
import { useState, useEffect } from "react";
import "./playlist.css";

import { useNavigate } from "react-router-dom";

function LikeButton({ song }) {

    const user = auth.currentUser

    const [isLiked, setIsLiked] = useState(song.isLiked || false);

    useEffect(() => {
        setIsLiked(song.isLiked);
    }, [song.isLiked]);

    const toggleLike = async (e) => {
        e.stopPropagation(); 
        if (!user) return;

        const newStatus = !isLiked;
        setIsLiked(newStatus); 

        const likeDocId = `${user.uid}_${song.id}`;
        const likeRef = doc(db, "userLikes", likeDocId);

        try {
            if (newStatus) {
                await setDoc(likeRef, {
                    userId: user.uid,
                    songId: song.id
                });
            } else {
                await deleteDoc(likeRef);
            }
        } catch (error) {
            console.error("Erreur like:", error);
            setIsLiked(!newStatus); 
        }
    };

    return (
        <FavoriteIcon 
            onClick={toggleLike}
            className={`like_btn_list ${isLiked ? 'active' : ''}`} 
        />
    );
}

function SongItem({ s, onSelect, currentSongId }) {

    const navigate = useNavigate()

    const goToArtist = (e) => {
        e.stopPropagation();
        navigate(`/profil/${s.authorId}`); 
    };

    return (
        <div 
            className={`song-item ${s.id === currentSongId ? 'active' : ''}`}
            onClick={() => onSelect(s)} 
        >   
            <div className="left">
                <img className="song-cover" src={s.coverUrl} alt={s.titleSong} />
            </div>                        
            <div className="center">
                <div className="p">
                    <strong>{s.titleSong}</strong> <br />
                    <span className="artist-name-list" onClick={goToArtist}>{s.artistName}</span>
                </div>
            </div>
            <LikeButton song={s} />
        </div>
    );
}

export default function PlaylistPage({ songs, onSelect, currentSongId }) {

    if (!songs || songs.length === 0) return <p className="p">Aucune musique trouvée.</p>;

    const likedSongs = songs.filter(s => s.isLiked === true);

    return (
        <div className="playlist-container">
            
            {likedSongs.length > 0 && (
                <div className="song-list" style={{ marginBottom: "40px" }}>
                    <div className="description subtitle" style={{ color: "#7b2cbf" }}>
                        Mes Favoris ({likedSongs.length})
                    </div>
                    {likedSongs.map((s) => (
                        <SongItem 
                            key={`liked-${s.id}`} 
                            s={s} 
                            onSelect={onSelect} 
                            currentSongId={currentSongId} 
                        />
                    ))}
                </div>
            )}

            <div className="song-list">
                <div className="description subtitle">Dernières sorties</div>
                {songs.map((s) => (
                    <SongItem 
                        key={`recent-${s.id}`} 
                        s={s} 
                        onSelect={onSelect} 
                        currentSongId={currentSongId} 
                    />
                ))}
            </div>
        </div>
    );
}