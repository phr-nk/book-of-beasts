import logo from "./logo.svg";
import book from "./blank_book_2.png";
import bookOpen from "./blank_book_open_forward.gif";
import player1 from "./player1.png";
import player2 from "./player2.png";
import beer from "./beer.png";
import ribbon from "./Red_Ribbon.png";
import luteTheme from "./lute_theme_2.mp3";
import luteTheme2 from "./lute_theme.mp3";
import luteTheme3 from "./lute_theme_3.mp3";
import ChessBoard from "./Chessboard/Chessboard";
import { useState, useMemo, useEffect, useRef } from "react";
import * as React from "react";
import { BlurFilter, TextStyle } from "pixi.js";
import * as PIXI from "pixi.js"; // Import PixiJS
import MedievalBeast from "./components/MedievalBeast/MedievalBeast";
import { Stage, Container, Sprite, Text } from "@pixi/react";
import seaHound from "./beasts/SeaHoundFlipped.png";
import jesterDawg from "./beasts/JesterDog.png";
import "./App.css";

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
  const playerRef = useRef(null);
  const enemyRef = useRef(null);
  const stageWidth = 600;
  const stageHeight = 500;
  const [beasts, setBeasts] = useState([
    {
      id: "enemy",
      image: seaHound,
      ref: enemyRef,
      scale: 0.2,
      flip: true,
      health: 100,
      x: 400,
      y: 250,
    },
    {
      id: "player",
      image: jesterDawg,
      ref: playerRef,
      scale: 0.3,
      flip: false,
      health: 100,
      x: 40,
      y: 250,
    },
  ]);

  useEffect(() => {
    const ticker = PIXI.Ticker.shared;

    const update = () => {
      const playerSprite = playerRef.current;
      const enemySprite = enemyRef.current;

      if (playerSprite && enemySprite) {
        // Check for wall collisions for the player
          // Move the sprites first
    playerSprite.x += playerSprite.velocity.x;
    playerSprite.y += playerSprite.velocity.y;
    enemySprite.x += enemySprite.velocity.x;
    enemySprite.y += enemySprite.velocity.y;

    // Check for wall collisions for the player
    if (playerSprite.x <= 0) {
      playerSprite.x = 0;
      playerSprite.velocity.x *= -1; // Reverse direction
    } else if (playerSprite.x + playerSprite.width >= stageWidth) {
      playerSprite.x = stageWidth - playerSprite.width;
      playerSprite.velocity.x *= -1; // Reverse direction
    }

    if (playerSprite.y <= 0) {
      playerSprite.y = 0;
      playerSprite.velocity.y *= -1; // Reverse direction
    } else if (playerSprite.y + playerSprite.height >= stageHeight) {
      playerSprite.y = stageHeight - playerSprite.height;
      playerSprite.velocity.y *= -1; // Reverse direction
    }

    // Check for wall collisions for the enemy
    if (enemySprite.x <= 0) {
      enemySprite.x = 0;
      enemySprite.velocity.x *= -1; // Reverse direction
    } else if (enemySprite.x + enemySprite.width >= stageWidth) {
      enemySprite.x = stageWidth - enemySprite.width;
      enemySprite.velocity.x *= -1; // Reverse direction
    }

    if (enemySprite.y <= 0) {
      enemySprite.y = 0;
      enemySprite.velocity.y *= -1; // Reverse direction
    } else if (enemySprite.y + enemySprite.height >= stageHeight) {
      enemySprite.y = stageHeight - enemySprite.height;
      enemySprite.velocity.y *= -1; // Reverse direction
    }
        // Check for collision between the two beasts
        if (checkCollision(playerSprite, enemySprite)) {
          console.log("Collision detected!");

          // Reverse the direction of both sprites
          playerSprite.velocity.x *= -1;
          playerSprite.velocity.y *= -1;
          enemySprite.velocity.x *= -1;
          enemySprite.velocity.y *= -1;

          // Adjust positions to prevent sticking
          const overlapX = Math.abs(playerSprite.x - enemySprite.x);
          const overlapY = Math.abs(playerSprite.y - enemySprite.y);
          if (overlapX < overlapY) {
            // Resolve horizontal overlap
            if (playerSprite.x < enemySprite.x) {
              playerSprite.x -= overlapX / 2;
              enemySprite.x += overlapX / 2;
            } else {
              playerSprite.x += overlapX / 2;
              enemySprite.x -= overlapX / 2;
            }
          } else {
            // Resolve vertical overlap
            if (playerSprite.y < enemySprite.y) {
              playerSprite.y -= overlapY / 2;
              enemySprite.y += overlapY / 2;
            } else {
              playerSprite.y += overlapY / 2;
              enemySprite.y -= overlapY / 2;
            }
          }

          // Decrease health
          setBeasts((prevBeasts) =>
            prevBeasts.map((beast) => {
              if (beast.id === "player") {
                return { ...beast, health: Math.max(0, beast.health - 10) };
              }
              if (beast.id === "enemy") {
                return { ...beast, health: Math.max(0, beast.health - 10) };
              }
              return beast;
            })
          );
        }
      }
    };
    if (!showModal) {
      ticker.add(update);
    } else {
      ticker.remove(update); // Stop the ticker when modal is shown
    }

    return () => {
      ticker.remove(update);
    };
  }, [showModal]);

  const checkCollision = (beast1, beast2) => {
    const bounds1 = beast1.getBounds();
    const bounds2 = beast2.getBounds();

    // Define hitbox size reduction
    const hitboxReduction = 50; // Adjust this value to change hitbox size

    return (
      bounds1.x + hitboxReduction <
        bounds2.x + bounds2.width - hitboxReduction &&
      bounds1.x + bounds1.width - hitboxReduction >
        bounds2.x + hitboxReduction &&
      bounds1.y + hitboxReduction <
        bounds2.y + bounds2.height - hitboxReduction &&
      bounds1.y + bounds1.height - hitboxReduction > bounds2.y + hitboxReduction
    );
  };
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
    setLeftPlayerHealth((prevHealth) => {
      const newHealth = prevHealth - 10;
      if (newHealth <= 0) {
        // Handle player death logic here
        return 0; // Prevent negative health
      }
      return newHealth;
    });
  };

  const handleRightPlayerDamage = () => {
    setRightPlayerHealth((prevHealth) => {
      const newHealth = prevHealth - 10;
      if (newHealth <= 0) {
        // Handle enemy death logic here
        return 0; // Prevent negative health
      }
      return newHealth;
    });
  };

  const handleHealthChange = (isAlive, id) => {
    if (!isAlive) {
      setBeasts((prevBeasts) => prevBeasts.filter((beast) => beast.id !== id));
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>A Book of Beasts</h2>
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
            onClick={handleButtonClick}
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
            width={stageWidth}
            height={stageHeight}
            options={{ backgroundColor: 0x5c3523 }}
          >
            <Container>
              {beasts.map((beast) => (
                <MedievalBeast
                  key={beast.id}
                  image={beast.image}
                  ref={beast.ref}
                  onHealthChange={(isAlive) =>
                    handleHealthChange(isAlive, beast.id)
                  }
                  scale={beast.scale}
                  x={beast.x} // Use stored position
                  y={beast.y} // Use stored position
                  velocity={{ x: beast.id === "player" ? 2 : -2, y: 0 }} // Move towards each other
                  stageWidth={stageWidth}
                  stageHeight={stageHeight}
                  flip={beast.flip}
                  health={beast.health} // Pass health prop
                />
              ))}
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
