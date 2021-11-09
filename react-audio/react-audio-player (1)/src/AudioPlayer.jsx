import React, { useState, useEffect, useRef } from "react";
import AudioControls from "./AudioControls";
import Backdrop from "./Backdrop";
import "./styles.css";
import { ReactComponent as Playing } from "./assets/playing.svg";

/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/building-an-audio-player-with-react-hooks
 */
const AudioPlayer = ({ tracks }) => {
  // State
  const [trackIndex, setTrackIndex] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [hidePlaylist, setHidePlaylist] = useState(true);

  // Destructure for conciseness
  const { title, artist, color, image, audioSrc } = tracks[trackIndex];

  // Refs
  const audioRef = useRef(new Audio(audioSrc));
  const intervalRef = useRef();
  const isReady = useRef(false);

  // Destructure for conciseness
  const { duration } = audioRef.current;

  const currentPercentage = duration
    ? `${(trackProgress / duration) * 100}%`
    : "0%";
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrack();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  const onScrub = (value) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  const toPrevTrack = () => {
    if (trackIndex - 1 < 0) {
      setTrackIndex(tracks.length - 1);
    } else {
      setTrackIndex(trackIndex - 1);
    }
  };

  const toNextTrack = () => {
    if (trackIndex < tracks.length - 1) {
      setTrackIndex(trackIndex + 1);
    } else {
      setTrackIndex(0);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Handles cleanup and setup when changing tracks
  useEffect(() => {
    audioRef.current.pause();

    audioRef.current = new Audio(audioSrc);
    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
    }
  }, [trackIndex]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div className={"playlist"} hidden={hidePlaylist}>
        <h4 style={{ position: "sticky", top: "0" }}>Playlist</h4>
        <div style={{ display: "flex", position: "relative" }}>
          {trackIndex === 0 && <Playing className="playlist-playing" />}
          <p className="song" onClick={() => setTrackIndex(0)}>
            Reality - Lost Frequencies
          </p>
        </div>
        <div style={{ display: "flex", position: "relative" }}>
          {trackIndex === 1 && <Playing className="playlist-playing" />}
          <p className="song" onClick={() => setTrackIndex(1)}>
            Hey Brother - Avicii
          </p>
        </div>
        <div style={{ display: "flex", position: "relative" }}>
          {trackIndex === 2 && <Playing className="playlist-playing" />}
          <p className="song" onClick={() => setTrackIndex(2)}>
            Galway Girl - Ed Sheeran
          </p>
        </div>
      </div>
      <div className="audio-player">
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setHidePlaylist((preState) => !preState)}
        >
          Playlist
        </div>
        <div className="track-info">
          <img
            className="artwork"
            src={image}
            alt={`track artwork for ${title} by ${artist}`}
          />
          <h2 className="title">{title}</h2>
          <h3 className="artist">{artist}</h3>
          <AudioControls
            isPlaying={isPlaying}
            onPrevClick={toPrevTrack}
            onNextClick={toNextTrack}
            onPlayPauseClick={setIsPlaying}
          />
          <input
            type="range"
            value={trackProgress}
            step="1"
            min="0"
            max={duration ? duration : `${duration}`}
            className="progress"
            onChange={(e) => onScrub(e.target.value)}
            onMouseUp={onScrubEnd}
            onKeyUp={onScrubEnd}
            style={{ background: trackStyling }}
          />
          <h3 className="artist">Volume</h3>
          <input
            type="range"
            value={volume * 100}
            min="0"
            max={100}
            className="volume"
            onChange={(e) => {
              const target = e.target;
              setVolume(e.target.value / 100);
              const min = target.min;
              const max = target.max;
              const val = target.value;
              target.style.backgroundSize =
                ((val - min) * 100) / (max - min) + "% 100%";
            }}
            // style={{
            //   background: `rgba(255, 255, 255, 0.8)`,
            //   backgroundSize: `70% 100%`
            // }}
          />
        </div>
        <Backdrop
          trackIndex={trackIndex}
          activeColor={color}
          isPlaying={isPlaying}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
