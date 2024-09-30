import logo from "./logo.svg";
import book from "./blank_book_2.png";
import bookOpen from "./blank_book_open_forward.gif";
import player1 from "./player1.png";
import player2 from "./player2.png";
import beer from "./beer.png";
import ribbon from "./Red_Ribbon.png";
import luteTheme from "./lute_theme.mp3";
import luteTheme2 from "./lute_theme_2.mp3";
import luteTheme3 from "./lute_theme_3.mp3";
import ChessBoard from "./Chessboard";
import { useState, useMemo, useEffect, useRef } from "react";
import * as React from "react";
import { BlurFilter, TextStyle } from "pixi.js";
import * as PIXI from "pixi.js"; // Import PixiJS
import { Stage, Container, Sprite, Text } from "@pixi/react";
import "./App.css";

const useDrag = ({ x, y }) => {
  const sprite = React.useRef();
  const [isDragging, setIsDragging] = React.useState(false);
  const [position, setPosition] = React.useState({ x, y });

  const onDown = React.useCallback(() => setIsDragging(true), []);
  const onUp = React.useCallback(() => setIsDragging(false), []);
  const onMove = React.useCallback(
    (e) => {
      if (isDragging && sprite.current) {
        setPosition(e.data.getLocalPosition(sprite.current.parent));
      }
    },
    [isDragging, setPosition]
  );

  return {
    ref: sprite,
    interactive: true,
    pointerdown: onDown,
    pointerup: onUp,
    pointerupoutside: onUp,
    pointermove: onMove,
    alpha: isDragging ? 0.5 : 1,
    anchor: 0.5,
    position,
  };
};
const DraggableBunny = ({ x = 400, y = 300, ...props }) => {
  const bind = useDrag({ x, y });

  return <Sprite image={beer} scale={0.001} {...bind} {...props} />;
};

function App() {
  const [showBookOpen, setShowBookOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [leftPlayerHealth, setLeftPlayerHealth] = useState(100);
  const [rightPlayerHealth, setRightPlayerHealth] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const audioRef = useRef(null);

  const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";
  var songs = [luteTheme, luteTheme2, luteTheme3];

  const handlePlayClick = () => {
    setShowModal(false);
    setIsPlaying(true);
    audioRef.current.play();
    // Start the game here
  };

  const handleCancelClick = () => {
    setShowModal(false);
  };
  const handleMuteClick = () => {
    setIsMuted(!isMuted);
  };

  const handleEnded = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    audioRef.current.src = songs[nextIndex];
    audioRef.current.play();
  };

  const handleButtonClick = () => {
    setShowBookOpen(true);
    clearTimeout(timeoutId);
    setTimeoutId(
      setTimeout(() => {
        setShowBookOpen(false);
        const bookOpenImage = document.querySelector(".overlay");
        if (bookOpenImage) {
          bookOpenImage.src = bookOpen;
        }
      }, 750)
    );
  };

  const handleLeftPlayerDamage = () => {
    setLeftPlayerHealth((prevHealth) => prevHealth - 10);
  };

  const handleRightPlayerDamage = () => {
    setRightPlayerHealth((prevHealth) => prevHealth - 10);
  };
  return (
    <div className="App">
      <header className="App-header">
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>A Book of Games</h2>
              <p>Inspired by the Alfonso X book </p>
              <button onClick={handlePlayClick}>Play</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        )}
        <div className="overlay-container">
          <div className="books">
            <img src={book} className="book" alt="logo" />
            {showBookOpen && (
              <img src={bookOpen} className="overlay" alt="logo" />
            )}
            <div className="player-health-bar-left">
              <span className="player-title-left">Player 1</span>
              <div
                className="health-bar-fill"
                style={{ width: `${leftPlayerHealth}%` }}
              ></div>
            </div>
            <div className="player-health-bar-right">
              <span className="player-title-right">Player 2</span>
              <div
                className="health-bar-fill"
                style={{ width: `${rightPlayerHealth}%` }}
              ></div>
            </div>
          </div>
          <img
            src={player1}
            className="player1"
            alt="logo"
            onClick={handleLeftPlayerDamage}
          />
          <img
            src={player2}
            className="player2"
            alt="logo"
            onClick={handleRightPlayerDamage}
          />
        </div>
        <div className="gameContainer">
          <Stage
            width={550}
            height={500}
            options={{ backgroundColor: 0x5c3523 }}
          >
            <Container>
              <ChessBoard width={550} height={500} />
              <DraggableBunny x={100} scale={0.5} />
              <DraggableBunny x={300} scale={0.2} />
              <DraggableBunny x={500} scale={0.3} />
              <DraggableBunny x={700} scale={0.3} />
            </Container>
          </Stage>
        </div>

        <div className="titleContainer">
          <img src={ribbon} className="ribbon" />
          <p className="title">A game by Frank Lenoci</p>
        </div>
      </header>

      <audio controls={true} ref={audioRef} autoPlay onEnded={handleEnded}>
        <source src={songs[currentSongIndex]} type="audio/mpeg" />
      </audio>
      <button onClick={handleMuteClick}>{isMuted ? "Unmute" : "Mute"}</button>
    </div>
  );
}

export default App;
