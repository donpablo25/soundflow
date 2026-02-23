import Navbar from "../Navbar/Navbar"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchUserRole, subscribeToAuthChanges } from "../../back/auth"
import { avoirSongsbyArtist, deleteSong } from "../../back/firestore" 
import MusicPlayer from "../component/mpFooter"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import "./profil.css" 
import { db } from "../../back/firebase" 
import { collection, getDoc, doc, query, where, getDocs } from "firebase/firestore"

export default function Profil() {
    const { id } = useParams() 
    const [currentUserRole, setCurrentUserRole] = useState(null)
    const [userSongs, setUserSongs] = useState([])
    const [profileData, setProfileData] = useState(null) 
    const [currentUser, setCurrentUser] = useState(null) 
    const [currentSong, setCurrentSong] = useState(null) 
    const [menuOpen, setMenuOpen] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (user) => {
            setCurrentUser(user)
            if(user){
                const role = await fetchUserRole(user)
                setCurrentUserRole(role)
            }else{
                setCurrentUserRole(null)
            }
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        const fetchArtistProfile = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", id))
                if (userDoc.exists()) {
                    setProfileData(userDoc.data())
                }

                const songs = await avoirSongsbyArtist(id)
                setUserSongs(songs)
            } catch (error) {
                console.error("Erreur lors du chargement du profil:", error)
            }
        }

        if (id) fetchArtistProfile()
    }, [id])

    const handleDelete = async (songID) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette chanson ?")) {
            try {
                await deleteSong(songID)
                setUserSongs(userSongs.filter(s => s.id !== songID))
                setMenuOpen(null)
            } catch (error) {
                alert("Erreur lors de la suppression")
            }
        }
    }

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

    const canEdit = currentUser?.uid === id || currentUserRole === "admin"

    return (
        <>
            <Navbar />
            <div className="profile-page-container">
                <div className="profile-main">
                    <img 
                        className="profile-avatar-large" 
                        src={profileData?.photoURL || "/default-avatar.png"} 
                        alt="pfpUser" 
                    />
                    <h2 className="user-name-title">{profileData?.username || profileData?.displayName}</h2>
                    <p className="song-count-text">nombre de single : {userSongs.length}</p>
                    
                    {canEdit && (
                        <button className="button is-dark is-rounded" onClick={() => navigate("/editprofil")}>
                            Modifier mon profil
                        </button>
                    )}
                </div>

                <div className="songs-grid">
                    {userSongs.map((song) => (
                        <div key={song.id} className="song-card" onClick={() => setCurrentSong(song)}>
                            <img src={song.coverUrl} alt={song.titleSong} className="song-cover" />
                            
                            <div className="song-info">
                                <span className="song-title">{song.titleSong}</span>
                                
                                {canEdit && (
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