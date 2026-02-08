import { useState, useEffect, useRef } from 'react';
import "./musicplayer.css"
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';


//chanson random
export default function MusicPlayer({song, onNext, onPrev}) {

    const [isplaying, setIsplaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const audioRef = useRef(null);
    const clickRef = useRef();

    const checkWidth = (e) => {
        const width = clickRef.current.clientWidth
        const offset = e.nativeEvent.offsetX

        const divprogress = (offset/width) * 100
        audioRef.current.currentTime = (divprogress/100) * duration
    }

    const formatTime = (time) =>{
        if (isNaN(time)) return "00:00"
        const minutes = Math.floor(time/60)
        const secondes = Math.floor(time%60)
        return `${minutes < 10 ? "0" : "" }${minutes}:${secondes < 10 ? "0" : ""}${secondes}`
    }

    const onPlaying = () => {
        const duration = audioRef.current.duration;
        const ct = audioRef.current.currentTime;
        setCurrentTime(ct)
        setProgress((ct / duration) * 100);
    };

    const togglePlay = () => {
        if (isplaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsplaying(!isplaying);
    };

    const onLoadedMetadata = () => {
        setDuration(audioRef.current.duration)
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
            if (isplaying) audioRef.current.play();
        }
    }, [song.audioUrl]);

    return (
<div className='player_container'>
        <audio ref={audioRef} src={song.audioUrl} onEnded={onNext} onTimeUpdate={onPlaying} onLoadedMetadata={onLoadedMetadata} />

        <div className='controls'>
            <SkipPreviousIcon onClick={onPrev} className='btn_action' />
            <div onClick={togglePlay} style={{ cursor: "pointer" }}>
                {isplaying ? <PauseCircleIcon className='pp' /> : <PlayCircleIcon className='pp' />}
            </div>
            <SkipNextIcon onClick={onNext} className='btn_action' />
        </div>

        <div className='navigation'>
            <div className="time_info" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ccc' }}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
            <div className='navigation_wrapper' ref={clickRef} onClick={checkWidth} style={{ background: '#333', height: '4px' }}>
                <div className='seek_bar' style={{ width: `${progress}%`, background: '#7b2cbf0' }}></div>
            </div>
        </div>

        <div className='title' style={{ display: 'flex', alignItems: 'center' }}>
            <div className='cover'><img src={song.coverUrl} alt="" /></div>
            <p style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>{song.titleSong} - {song.artistName}</p>
        </div>
    </div>
    );
}