import { useNavigate } from "react-router-dom";
import "./playlist.css"

export default function PlaylistPage({ songs, onSelect, currentSongId }) {
    
    const navigate = useNavigate()
    if (!songs || songs.length === 0) return <p className="p">Aucune musique trouvée.</p>;

    const artistesUniques = Array.from(
        new Map(songs.map(s=>[s.artistName,{name: s.artistName, id:s.authorId}])).values()
    )

    return (
        <div className="playlist-container">
            <div className="artists-header" style={{ marginBottom: "20px" }}>
                <div className="description subtitle">Artistes présents</div>
                <div className="artists-chips" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {artistesUniques.map((artist) => (
                        <span 
                            key={artist} 
                            className="artist-chip"
                            onClick={()=>navigate(`/profil/${artist.id}`)}
                            style={{
                                padding: "5px 15px",
                                borderRadius: "20px",
                                background: "rgba(110, 49, 222, 0.2)",
                                border: "1px solid #6E31DE",
                                color: "#fff",
                                fontSize: "0.9rem"
                            }}
                        >
                            {artist.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="song-list">
                <div className="description subtitle">Les dernières chansons</div>
                {songs.map((s) => (
                    <div 
                        key={s.id} 
                        className={`song-item ${s.id === currentSongId ? 'active' : ''}`}
                        onClick={() => onSelect(s)} 
                        style={{ cursor: "pointer" }}
                    >   
                        <div className="left">
                            <img 
                                className="song-cover"
                                src={s.coverUrl} 
                                alt={s.titleSong} 
                                style={{ width: '100px', height: "100px", objectFit: "cover", borderRadius: "8px" }} 
                            />
                        </div>                        
                        <div className="center">
                            <p className="p">
                                <strong>{s.titleSong}</strong> <br />
                                <span style={{ color: "#b3b3b3" }}>{s.artistName}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}