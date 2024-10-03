import * as PIXI from "pixi.js";
import * as React from "react";
import { Sprite, Text, Container, Graphics } from "@pixi/react";
import { useState, useImperativeHandle, useRef, useEffect } from "react";
/*
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
}
*/

const MedievalBeast = React.forwardRef((props, ref) => {
  const {
    image,
    stageWidth,
    stageHeight,
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



/*
  const decreaseHealth = (amount) => {
    setHealth((prevHealth) => {
      const newHealth = prevHealth - amount;
      if (newHealth <= 0) {
        onHealthChange(false); // Notify that the beast should be removed
      }
      return Math.max(newHealth, 0); // Prevent negative health
    });
  };
*/
  return (
    <Container>
      <Sprite ref={ref} image={image} {...props}      />

      <Container>
        <Graphics ref={healthBarRef} x={spriteX} y={spriteY - 50} height={10} />
        <Text
          ref={healthTextRef}
          text={`Health: ${health}`}
          x={spriteX}
          y={spriteY - 100}
          style={{ fill: 0x000000 }}
        />
      </Container>
    </Container>
  );
});
export default MedievalBeast;
