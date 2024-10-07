import * as PIXI from "pixi.js";
import * as React from "react";
import { Sprite, Text, Container, Graphics } from "@pixi/react";
import { useState, useImperativeHandle, useRef, useEffect } from "react";


const MedievalBeast = React.forwardRef((props, ref) => {
  const {
    image,
    stageWidth,
    stageHeight,
    isHit,
    onHealthChange,
    health,
    flip,
    x = 500,
    y = 300,
  } = props;
  //const [health, setHealth] = useState(100);
  const healthTextRef = useRef(null);
  const healthBarRef = useRef(null);
  const spriteRef = useRef(); // Add a ref for the Sprite
  const [spriteX, setSpiteX] = useState(x);
  const [spriteY, setSpiteY] = useState(y);
    // Set scale for Y-axis flip
  //const bind = useDrag({ x, y });
/*
  const velocity = useRef({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
  });
*/
const velocity = useRef({x: 0, y: 0})


  useEffect(() => {

    if (ref.current) {
      ref.current.velocity = velocity.current;
    }
    const move = () => {
      const sprite = ref.current;
      if (healthTextRef.current) {
        healthTextRef.current.text = `Health: ${health}`;
      }
      const healthBar = healthBarRef.current;
      if (healthBar) {

        healthBar.clear();
        // Draw white background
        healthBar.beginFill("white") // White background
        healthBar.drawRect(0, 0, 100, 10); // Background width
        healthBar.endFill();

        healthBar.beginFill("red");
        healthBar.drawRect(0, 0, (health / 100) * 100, 10); // 100 is the full width
        healthBar.endFill();
      }

      if (sprite) {
        // Move the sprite
        sprite.x += velocity.current.x;
        sprite.y += velocity.current.y;

        setSpiteX(sprite.x);
        setSpiteY(sprite.y);

        // Bounce off stage walls
        if (sprite.x <= 0 || sprite.x + sprite.width >= stageWidth) {
          velocity.current.x *= -1; // Reverse direction on x-axis
        }
        if (sprite.y <= 0 || sprite.y + sprite.height >= stageHeight) {
          velocity.current.y *= -1; // Reverse direction on y-axis
        }
      }
    };

    const ticker = PIXI.Ticker.shared;
    ticker.add(move);

    return () => {
      ticker.remove(move);
    };
  }, [ref, stageWidth, stageHeight, health]);



  return (
    <Container>
      <Sprite ref={ref} image={image} {...props}   tint={isHit ? (0xFf0000) : (0xffffff)}  />
      {isHit &&(
        <Text
        text={"Beast Hit"}
        x={spriteX}
        y={spriteY - 80}
        style={{ fill: 0xFf0000, fontFamily: "Jacquard 12",  stroke: 0xffffff,   strokeThickness: 5,  dropShadowColor: '#ccced2',}}
        scale={0.8}
        />
      )}
      <Container>
        <Graphics ref={healthBarRef} x={spriteX} y={spriteY - 50} height={10} />
        <Text
          ref={healthTextRef}
          text={`Health: ${health}`}
          x={spriteX}
          y={spriteY - 40}
          style={{ fill: 0x000000, fontFamily: "Jacquard 12",  stroke: 0xffffff,   strokeThickness: 5,  dropShadowColor: '#ccced2',}}
          scale={0.8}
          

        />
      </Container>
    </Container>
  );
});
export default MedievalBeast;
