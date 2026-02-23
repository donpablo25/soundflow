import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import MusicPlayer from "../component/mpFooter";
import PlaylistPage from "../component/playlist";
import { avoirArticle } from "../../back/firestore";
import { subscribeToAuthChanges } from "../../back/auth";
import "./List.css"


export default function List() {
    const [songs, setSongs] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [user, setUser] = useState(null)
    
    const [currentSong, setCurrentSong] = useState(null);

    useEffect(()=>{
        const unsubcribe = subscribeToAuthChanges((currentUser)=>{
            setUser(currentUser)
        })
        return () => unsubcribe()
    },[])

    useEffect(() => {
        const chargerMusiques = async () => {
            const data = await avoirArticle();
            setSongs(data);

            if(data.length > 0) setCurrentSong(data[0]); 
            setLoading(false);
        };
        chargerMusiques();
    }, []);

    const SongsFiltre = songs.filter((song) => {
        const searchLower = search.toLowerCase();
        return (
            song.titleSong?.toLowerCase().includes(searchLower) || 
            song.artistName?.toLowerCase().includes(searchLower)
        );
    });

    const suivant = () => {
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex + 1) % songs.length;
        setCurrentSong(songs[nextIndex]);
    };

    const precedent = () => {
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        setCurrentSong(songs[prevIndex]);
    };

    return (
        <>
            <Navbar/>
            <div className="section-input">
                <h3 className="title is-3">Bienvenue {user?.displayName}</h3>
                <input 
                    className="input" 
                    type="text" 
                    placeholder="Cherchez..."
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                />
            </div>

            <div className="playlist">
                <PlaylistPage 
                    songs={SongsFiltre} 
                    onSelect={(song) => setCurrentSong(song)} 
                    currentSongId={currentSong?.id}
                />
            </div>

            {currentSong && (
                <MusicPlayer 
                    song={currentSong} 
                    onNext={suivant} 
                    onPrev={precedent} 
                />
            )}
        </>
    );
}