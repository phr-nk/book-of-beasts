import * as PIXI from "pixi.js";
import * as React from "react";
import { Sprite, Text, Container, Graphics } from "@pixi/react";
import { useState, useMemo, useEffect, useRef } from "react";

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
const MedievalBeast = ({ image, x = 400, y = 300, ...props }) => {
  const [health, setHealth] = useState(100);
  const healthTextRef = useRef(null);
  const healthBarRef = useRef(null);
  const bind = useDrag({ x, y });

  const handleHealthChange = (newHealth) => {
    setHealth(newHealth);
    healthTextRef.current.text = `Health: ${newHealth}`;

    // Update the health bar width and fill color
    const healthBar = healthBarRef.current;
    if (healthBar) {
      healthBar.clear();
      healthBar.beginFill(0xff00432);
      healthBar.drawRect(0, 0, (newHealth / 100) * healthBar.parent.width, 10);
      healthBar.endFill();
    }
  };

  return (
    <Container>
      <Sprite image={image} {...bind} {...props} />
      <Container>
        <Graphics ref={healthBarRef} x={0} y={50} height={10} />
        <Text
          ref={healthTextRef}
          text={`Health: ${health}`}
          x={10}
          y={65}
          style={{ fill: 0xffffff }}
        />
      </Container>
    </Container>
  );
};
export default MedievalBeast;
