import Image from 'next/image'
import { useContext, useRef, useEffect, useState } from 'react'
import { PlayerContext } from '../../contexts/PlayerContext'
import styles from './styles.module.scss'
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'
import { convertDurationTime } from '../../utils/convertDurationTime'

export function Player() {

    const audioRef = useRef<HTMLAudioElement>(null)

    const [progress, setProgress] = useState(0)

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying,
        hasNext,
        hasPrevious,
        isLooping, 
        isShuffling, 
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState, 
        playNext, 
        playPrevious,
        createPlayerState
    } = useContext(PlayerContext)

    const episode = episodeList[currentEpisodeIndex]
    
    useEffect(() => {
        if (!audioRef.current){
            return
        }

        if (isPlaying){
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount
        setProgress(amount)
    }

    function handleEpisodeEnded() {
        if(hasNext){
            playNext()
        } else{
            createPlayerState()
        }
    }
    
    return(
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando Agora {episode?.title}</strong>
            </header>

            {   episode ? (
                    <div className={styles.currentEpisode}>
                        <Image 
                            width={592} 
                            height={592} 
                            src={episode.thumbnail}
                            objectFit='cover' 
                        />

                        <strong>{episode.title}</strong>
                        <span>{episode.members}</span>

                    </div>
                ): (
                    <div className={styles.emptyPlayer}>
                        <small>Selecione um podcast para ouvir!</small>
                    </div>
                )
            }
            

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationTime(progress)}</span>

                
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider 
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04D361'}}
                                railStyle={{ backgroundColor: '#9f75ff'}}
                                handleStyle={{ borderColor: '#04D361', borderWidth: 2}}
                            />
                        ) : (
                            <div className={styles.emptySlider} />)
                        }
                        
                    </div>
                    
                    <span>{convertDurationTime(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        loop={isLooping}
                        autoPlay
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onEnded={handleEpisodeEnded}
                        onLoadedMetadata={setupProgressListener}
                    />            
                )}

                <div className={styles.buttons}>
                    <button 
                        type="button" 
                        disabled={!episode || episodeList.length === 1}  
                        className={isShuffling  ? styles.isActive : ''} 
                        onClick={toggleShuffle}
                    >
                        <img src="/shuffle.svg" alt="Aleatório"/>
                    </button>

                    <button type="button" disabled={!episode || !hasPrevious}  onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>

                    <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
                        {isPlaying ? (
                            <img src="/pause.svg" alt="Tocar"/>
                        ) : (
                            <img src="/play.svg" alt="Tocar"/>
                        )}
                    </button>

                    <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="/play-next.svg" alt="Tocar Próxima" />
                    </button>

                    <button 
                        type="button" 
                        disabled={!episode} 
                        className={isLooping  ? styles.isActive : ''} 
                        onClick={toggleLoop}
                    >
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}