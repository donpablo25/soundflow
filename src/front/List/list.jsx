import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import MusicPlayer from "../component/mpFooter";
import PlaylistPage from "../component/playlist";
import { avoirArticle } from "../../back/firestore";
import "./List.css"

// List.js
export default function List() {
    const [songs, setSongs] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    
    // NOUVEL ÉTAT : Pour garder la musique fixe même si on filtre
    const [currentSong, setCurrentSong] = useState(null);

    useEffect(() => {
        const chargerMusiques = async () => {
            const data = await avoirArticle();
            setSongs(data);
            // On initialise la première chanson si nécessaire, 
            // mais on ne l'affiche que si l'utilisateur clique ou charge
            if(data.length > 0) setCurrentSong(data[0]); 
            setLoading(false);
        };
        chargerMusiques();
    }, []);

    // Ta logique de filtre reste la même pour la PlaylistPage
    const SongsFiltre = songs.filter((song) => {
        const searchLower = search.toLowerCase();
        return (
            song.titleSong?.toLowerCase().includes(searchLower) || 
            song.artistName?.toLowerCase().includes(searchLower)
        );
    });

    // Fonctions de navigation basées sur la liste complète (ou filtrée, selon ton choix)
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
                <input 
                    className="input" 
                    type="text" 
                    placeholder="Cherchez..."
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} // On ne change plus l'index ici !
                />
            </div>

            <div className="playlist">
                {/* On passe une fonction qui change la chanson au clic */}
                <PlaylistPage 
                    songs={SongsFiltre} 
                    onSelect={(song) => setCurrentSong(song)} 
                    currentSongId={currentSong?.id}
                />
            </div>

            {/* Le MusicPlayer utilise currentSong, qui ne change pas quand on tape du texte */}
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