import Navbar from "../Navbar/Navbar"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { subscribeToAuthChanges } from "../../back/auth"
import { avoirSongsbyArtist, deleteSong } from "../../back/firestore" 
import MusicPlayer from "../component/mpFooter"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import "./profil.css" 

export default function Profil() {
    const [userSongs, setUserSongs] = useState([])
    const [user, setUser] = useState(null)
    const [currentSong, setCurrentSong] = useState(null) 
    const [menuOpen, setMenuOpen] = useState(null)
    const navigate = useNavigate()

    // Gestion de la suppression
    const handleDelete = async (songID) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette chanson?")) {
            await deleteSong(songID)
            setUserSongs(userSongs.filter(s => s.id !== songID))
            setMenuOpen(null)
        }
    }

    useEffect(() => {
        const unsubcribe = subscribeToAuthChanges((currentUser) => {
            setUser(currentUser)
        })
        return () => unsubcribe()
    }, [])

    useEffect(() => {
        if (user) {
            const loadSongs = async () => {
                const songs = await avoirSongsbyArtist(user.uid); 
                setUserSongs(songs);
            };
            loadSongs();
        }
    }, [user]);

    const handleNext = () => {
        const currentIndex = userSongs.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % userSongs.length;
        setCurrentSong(userSongs[nextIndex]);
    };

    const handlePrev = () => {
        const currentIndex = userSongs.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + userSongs.length) % userSongs.length;
        setCurrentSong(userSongs[prevIndex]);
    };

    return (
        <>
            <Navbar />
            <div className="profile-page-container">
                <div className="profile-main">
                    <img className="profile-avatar-large" src={user?.photoURL} alt="pfpUser" />
                    <h2 className="user-name-title">{user?.displayName}</h2>
                    <p className="song-count-text">nombre de single : {userSongs.length}</p>
                    
                    {user && (
                        <button className="button is-dark is-rounded" onClick={() => navigate("/editprofil")}>
                            Modifier le profil
                        </button>
                    )}
                </div>

                <div className="songs-grid">
                    {userSongs.map((song) => (
                        <div key={song.id} className="song-card" onClick={() => setCurrentSong(song)}>
                            <img src={song.coverUrl} alt={song.titleSong} className="song-cover" />
                            
                            <div className="song-info">
                                <span className="song-title">{song.titleSong}</span>
                                
                                {user?.uid === song.authorId && (
                                    <div className="menu-container">
                                        <MoreHorizIcon 
                                            className="btn-more-icon" 
                                            onClick={(e) => {
                                                e.stopPropagation(); 
                                                setMenuOpen(menuOpen === song.id ? null : song.id);
                                            }} 
                                        />
                                        
                                        {menuOpen === song.id && (
                                            <div className="dropdown-menu">
                                                <button onClick={() => navigate(`/edit-song/${song.id}`)}>
                                                    Modifier
                                                </button>
                                                <button className="has-text-danger" onClick={() => handleDelete(song.id)}>
                                                    Supprimer
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {currentSong && (
                    <div className="player-wrapper">
                        <MusicPlayer song={currentSong} onNext={handleNext} onPrev={handlePrev} />
                    </div>
                )}
            </div>
        </>
    )
}