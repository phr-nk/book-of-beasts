import * as PIXI from "pixi.js";
import { Stage, Container, Sprite, Text } from "@pixi/react";

const ChessBoard = ({ width, height }) => {
  const squareSize = 60;
  const boardWidth = squareSize * 8;
  const boardHeight = squareSize * 8;

  const squares = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = {};
      square.texture = PIXI.Texture.WHITE;
      square.x = j * squareSize;
      square.y = i * squareSize;
      square.width = squareSize;
      square.height = squareSize;

      if ((i + j) % 2 === 1) {
        square.tint = 0x5c3523; // Dark gray for alternating squares
      }

      squares.push(square);
    }
  }

  return (
    <Container width={width} height={height}>
      {squares.map((square, index) => (
        <Sprite key={index} {...square} />
      ))}
    </Container>
  );
};

export default ChessBoard;
