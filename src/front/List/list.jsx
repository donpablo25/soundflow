import { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import MusicPlayer from "../component/mpFooter";

import { avoirArticle } from "../../back/firestore";

export default function List() {
    const [songs, setSongs] = useState([]); 
    const [currentIndex, setCurrentIndex] = useState(0); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const chargerMusiques = async () => {
            const data = await avoirArticle();
            setSongs(data);
            setLoading(false);
        };
        chargerMusiques();
    }, []);

    const suivant = () => {
        setCurrentIndex((prev) => (prev + 1) % songs.length);
    };

    const precedent = () => {
        setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
    };

    if (loading) return <div>Chargement de SoundFlow...</div>;

    return (
        <>  
         <Navbar/>

        {songs.length > 0 && (
            <MusicPlayer 
                song={songs[currentIndex]} 
                onNext={suivant} 
                onPrev={precedent} 
            />
        )}


        </>
    );
}