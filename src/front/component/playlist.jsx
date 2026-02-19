import "./playlist.css"

export default function PlaylistPage({ songs, onSelect, currentSongId }) {
    
    if (!songs || songs.length === 0) return <p className="p">Aucune musique trouvée.</p>;

    return (
        <div className="playlist-container">
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
                                src={s.coverUrl} 
                                alt={s.titleSong} 
                                style={{ width: '100px', height: "100px", objectFit: "cover" }} 
                            />
                        </div>                        
                        <div className="center">
                            <p className="p">{s.titleSong} - {s.artistName}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}