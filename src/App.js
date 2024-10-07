import book from "./blank_book_2.png";
import bookOpen from "./blank_book_open_forward.gif";
import player1 from "./player1.png";
import player2 from "./player2.png";
import ribbon from "./Red_Ribbon.png";
import luteTheme from "./lute_theme_2.mp3";
import { useState, useMemo, useEffect, useRef } from "react";
import * as React from "react";
import * as PIXI from "pixi.js"; // Import PixiJS
import MedievalBeast from "./components/MedievalBeast/MedievalBeast";
import { Stage, Container, Sprite, Text } from "@pixi/react";
import seaHound from "./beasts/SeaHoundFlipped.png";
import crazyMFRabbit from "./beasts/rabbitWithBranch.png";
import birdBalls from "./beasts/birdBallFace.png";
import jesterDawg from "./beasts/JesterDog.png";
import TreeMammal from "./beasts/TreeMammal.png";
import guySnake from "./beasts/guyBirdSnakeHead.png";
import bigEars from "./beasts/BigEars.png";
import castle from "./backgrounds/field_castle.jpeg";
import tower from "./backgrounds/field_tower.jpeg";
import cave from "./backgrounds/cave.jpeg";
import mountain from "./backgrounds/mountain.jpeg";
import tavern from "./backgrounds/tavern.jpeg";
import "./App.css";

var backgrounds = [castle, tower, cave, mountain, tavern];

var beastImages = [seaHound, crazyMFRabbit, birdBalls, bigEars];

var playerBeasts = [jesterDawg, TreeMammal, guySnake];

function App() {
  const [showBookOpen, setShowBookOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [leftPlayerHealth, setLeftPlayerHealth] = useState(100);
  const [rightPlayerHealth, setRightPlayerHealth] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const [showEnemyKilledModal, setShowEnemyKilledModal] = useState(false);
  const [showPlayerKilledModal, setShowPlayerKilledModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showGameContainer, setshowGameContainer] = useState(false);
  const [showPlayerArea, setShowPlayerArea] = useState(false);
  const [selectedBeast, setSelected] = useState(jesterDawg);
  const [background, setBackground] = useState(castle);
  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const enemyRef = useRef(null);
  const stageWidth = window.innerWidth > 768 ? (window.innerWidth / 3) : (window.innerWidth / 1.2);
  const stageHeight = window.innerWidth > 768 ? window.innerHeight / 2 : window.innerHeight / 4 ;
  const [playerXVelocity, setplayerXVelocity] = useState(0);
  const [playerYVelocity, setplayerYVelocity] = useState(0);
  const [enemyXVelocity, setEnemyXVelocity] = useState(0);
  const [enemyYVelocity, setEnemyYVelocity] = useState(0);
  const [playerX, setPlayerX] = useState(25);
  const [playerY, setPlayerY] = useState(250);
  const [enemyX, setEnemyX] = useState(300);
  const [enemyY, setEnemyY] = useState(250);
  var songs = [luteTheme];
  var starterBeasts = [
    {
      id: "enemy",
      image: seaHound,
      ref: enemyRef,
      scale:window.innerWidth > 768 ?  0.15 : 0.1,
      flip: true,
      health: 100,
      x: enemyX,
      y: enemyY,
      isHit: false,
    },
    {
      id: "player",
      image: selectedBeast,
      ref: playerRef,
      scale: window.innerWidth > 768 ? 0.25 : 0.1,
      flip: false,
      health: 100,
      x: playerX,
      y: playerY,
      isHit: false,
    },
  ];

  const [beasts, setBeasts] = useState(starterBeasts);

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

        //setPlayerX(playerSprite.x)
        //setPlayerY(playerSprite.y)
        //setEnemyX(enemySprite.x)
        //setEnemyY(enemySprite.y)

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
          setplayerXVelocity(0);
          setplayerYVelocity(0);
          beasts.find((beast) => beast.id === "player").velocity = {
            x: 0,
            y: 0,
          };

          // Decrease health with random damage to one beast
          setBeasts((prevBeasts) => {
            const randomBeastIndex = Math.floor(
              Math.random() * prevBeasts.length
            );
            const targetBeast = prevBeasts[randomBeastIndex];
            const damage = Math.floor(Math.random() * 70) + 1; // Generate random damage

            return prevBeasts.map((beast) => {
              if (beast === targetBeast) {
                const newHealth = Math.max(0, beast.health - damage);
                if (newHealth === 0 && beast.id === "enemy") {
                  setShowEnemyKilledModal(true);
                  const randomBackgroundIndex = Math.floor(
                    Math.random() * backgrounds.length
                  );
                  setBackground(backgrounds[randomBackgroundIndex]);
                  setRightPlayerHealth((prevHealth) => {
                    const updatedHealth = Math.max(0, prevHealth - 30);
                    if (updatedHealth <= 0) {
                      setShowWinModal(true);
                      setShowPlayerArea(false);
                    }
                    return updatedHealth;
                  });
                  const randomImage =
                    beastImages[Math.floor(Math.random() * beastImages.length)];
                  const randomScale = Math.random() * 0.4 + 0.1; // Random scale between 0.1 and 0.3
                  return {
                    ...beast,
                    health: 100,
                    image: randomImage,
                    scale: randomScale,

                    // Maintain current x and y positions
                    x: beast.x,
                    y: beast.y,
                  };
                } else if (newHealth === 0 && beast.id === "player") {
                  setShowPlayerKilledModal(true);
                  const randomBackgroundIndex = Math.floor(
                    Math.random() * backgrounds.length
                  );
                  setBackground(backgrounds[randomBackgroundIndex]);
                  setLeftPlayerHealth((prevHealth) => {
                    const updatedHealth = Math.max(0, prevHealth - 30);
                    if (updatedHealth <= 0) {
                      setShowGameOverModal(true);
                      setShowPlayerArea(false);
                    }
                    return updatedHealth;
                  });
                }
                return {
                  ...beast,
                  health: newHealth,
                  x: beast.x,
                  y: beast.y,
                  isHit: true,
                }; // Maintain position
              } else {
                return beast; // Keep other beasts unchanged
              }
            });
          });
          // Reset the hit state after a brief moment
          setTimeout(() => {
            setBeasts((prevBeasts) => {
              return prevBeasts.map((beast) => {
                if (beast.id === "player" || beast.id === "enemy") {
                  return { ...beast, isHit: false };
                }
                return beast;
              });
            });
          }, 1500); // Adjust the duration as needed (300ms for example)
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
  }, [showModal, leftPlayerHealth, rightPlayerHealth]);

  // Set up random movement intervals for the right beast
  useEffect(() => {
    const moveInterval = setInterval(() => {
      const randomTime = Math.random() * 5000 + 2000; // Random time between 2 and 7 seconds
      setTimeout(handleRightBeastMove, randomTime);
    }, 4000); // Check for movement every 7 seconds

    return () => clearInterval(moveInterval);
  }, []);

  const checkCollision = (beast1, beast2) => {
    const bounds1 = beast1.getBounds();
    const bounds2 = beast2.getBounds();

    // Define hitbox size reduction
    const hitboxReduction = 10; // Adjust this value to change hitbox size

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

  const handlePlayClick = () => {
    setShowModal(false);
    setIsPlaying(true);
    setshowGameContainer(true);
    setShowPlayerArea(true);

    audioRef.current.play();
  };

  const handleCancelClick = () => {
    setShowModal(false);
    setshowGameContainer(true);
    setShowPlayerArea(true);
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

  const handleNextBattle = () => {
    setShowEnemyKilledModal(false);
    setShowPlayerKilledModal(false);
    setShowWinModal(false);
    setShowGameOverModal(false);
    setShowPlayerArea(true);
    setBeasts((prevBeasts) =>
      prevBeasts.map((beast) => {
        if (beast.id === "player") {
          return { ...beast, health: 100 };
        }
        if (beast.id === "enemy") {
          return { ...beast, health: 100 };
        }
        return beast;
      })
    );
  };

  const handleAttack = () => {
    setplayerXVelocity(4);
  };
  const handleJump = () => {
    setplayerYVelocity(-4);
  };
  const handleBeastSelect = (image) => {
    setSelected(image); // Toggle the state
    setBeasts((prevBeasts) =>
      prevBeasts.map((beast) => {
        if (beast.id === "player") {
          if (image !== jesterDawg) {
            return { ...beast, image: image, scale: window.innerWidth > 768 ? 0.6 : 0.35 };
          } else {
            return { ...beast, image: image };
          }
        }

        return beast;
      })
    );
  };
  const handleNewGame = () => {
    setLeftPlayerHealth(100);
    setRightPlayerHealth(100);
    setShowEnemyKilledModal(false);
    setShowPlayerKilledModal(false);
    setShowWinModal(false);
    setShowGameOverModal(false);
    setshowGameContainer(false);
    setShowBookOpen(true);
    setBeasts(starterBeasts);
    clearTimeout(timeoutId);
    setTimeoutId(
      setTimeout(() => {
        setShowBookOpen(false);
        const bookOpenImage = document.querySelector(".overlay");
        if (bookOpenImage) {
          bookOpenImage.src = bookOpen;
        }
        setshowGameContainer(true);
        setShowPlayerArea(true);
      }, 750)
    );

    setBeasts((prevBeasts) =>
      prevBeasts.map((beast) => {
        if (beast.id === "player") {
          if (beast.image !== jesterDawg) {
            return { ...beast, health: 100, scale: 0.6 };
          } else {
            return { ...beast, health: 100 };
          }
        }
        if (beast.id === "enemy") {
          return { ...beast, health: 100 };
        }
        return beast;
      })
    );
  };

  // Function to handle the right beast's movement
  const handleRightBeastMove = () => {
    const randomXVelocity = (Math.random() - 0.5) * 4; // Random velocity between -2 and 2
    const randomYVelocity = (Math.random() - 0.5) * 4; // Random velocity between -2 and 2
    setEnemyXVelocity(randomXVelocity);
    setEnemyYVelocity(randomYVelocity);
  };

  return (
    <div className="App">
      <header className="App-header">
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>A Book of Beasts</h2>
              <p>
                Inspired by the Book of Games, made for the King Alfonso X of
                Castile{" "}
              </p>

              <h3>Choose your beast</h3>
              <div className="playerBeasts">
                {playerBeasts.map((beast) => (
                  <div>
                    {beast === selectedBeast ? (
                      <img
                        className="playerBeast selectedStarterBeast"
                        src={beast}
                        alt="player beast"
                        onClick={() => handleBeastSelect(beast)}
                      />
                    ) : (
                      <img
                        className="playerBeast"
                        src={beast}
                        alt="player beast"
                        onClick={() => handleBeastSelect(beast)}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="buttons">
                <button className="modalButton" onClick={handlePlayClick}>
                  Play
                </button>
                <button className="modalButton" onClick={handleCancelClick}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showEnemyKilledModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Beast Slain</h2>
              <div className="buttons">
                <button className="modalButton" onClick={handleNextBattle}>
                  Next beast
                </button>
                <button className="modalButton" onClick={handleNextBattle}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showPlayerKilledModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Your Beast Has Been Slain</h2>
              <div className="buttons">
                <button className="modalButton" onClick={handleNextBattle}>
                  Try again
                </button>
                <button className="modalButton" onClick={handleNextBattle}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showWinModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>You win, huzzah!</h2>
              <div className="buttons">
                <button className="modalButton" onClick={handleNewGame}>
                  Play again
                </button>
                <button className="modalButton" onClick={handleNewGame}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showGameOverModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Your battle ends here....</h2>
              <div className="buttons">
                <button className="modalButton" onClick={handleNewGame}>
                  Play again
                </button>
                <button className="modalButton" onClick={handleNewGame}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="overlay-container">
          <div className="actionButtons">
            <button className="attackButton" onClick={handleAttack}>
              Attack
            </button>
            <button className="jumpButton" onClick={handleJump}>
              Jump
            </button>
          </div>
          <div className="books">
            <img src={book} className="book" alt="logo" />
            {showBookOpen && (
              <img src={bookOpen} className="overlay" alt="logo" />
            )}
          </div>
          {showPlayerArea && (
            <div className="playerArea">
              <div className="player-health-bar-left">
                <span className="player-title-left">You</span>
                <div
                  className="health-bar-fill"
                  style={{ width: `${leftPlayerHealth}%` }}
                ></div>
              </div>
              <div className="player-health-bar-right">
                <span className="player-title-right">Enemy</span>
                <div
                  className="health-bar-fill"
                  style={{ width: `${rightPlayerHealth}%` }}
                ></div>
              </div>

              <img src={player1} className="player1" alt="logo" />

              <img src={player2} className="player2" alt="logo" />
            </div>
          )}
        </div>
        <div className="gameContainer">
          {showGameContainer && (
            <Stage
              width={stageWidth}
              height={stageHeight}
              options={{ backgroundColor: 0x5c3523 }}
            >
              <Sprite
                image={background}
                width={stageWidth}
                height={stageHeight}
              />
              <Container>
                {beasts.map((beast) => (
                  <MedievalBeast
                    key={beast.id}
                    image={beast.image}
                    ref={beast.ref}
                    scale={beast.scale}
                    x={beast.x} // Use stored position
                    y={beast.y} // Use stored position
                    velocity={{
                      x:
                        beast.id === "player"
                          ? playerXVelocity
                          : enemyXVelocity,
                      y:
                        beast.id === "player"
                          ? playerYVelocity
                          : enemyYVelocity,
                    }}
                    stageWidth={stageWidth}
                    stageHeight={stageHeight}
                    flip={beast.flip}
                    health={beast.health}
                    isHit = {beast.isHit}
                  />
                ))}
              </Container>
            </Stage>
          )}
        </div>

        <div className="titleContainer">
          <img src={ribbon} className="ribbon" alt="ribbon" />
          <p className="title">
            A game by{" "}
            <a
              className="nameLink"
              href="https://www.frank-lenoci.me"
              rel="noreferrer"
              target="_blank"
            >
              Frank Lenoci
            </a>
          </p>
        </div>
      </header>

      <audio ref={audioRef} autoPlay onEnded={handleEnded}>
        <source src={songs[currentSongIndex]} type="audio/mpeg" />
      </audio>
      <button onClick={handleMuteClick}>{isMuted ? "Unmute" : "Mute"}</button>
    </div>
  );
}

export default App;
