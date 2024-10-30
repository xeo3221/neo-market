import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useThrottle } from "@/hooks/use-throttle";

interface FloatingCardProps {
  card: {
    name: string;
    image: string;
  };
  index: number;
}

export const FloatingCard = React.memo(({ card, index }: FloatingCardProps) => {
  const [position, setPosition] = useState(() => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  }));
  const [offset, setOffset] = useState(() => ({
    x: (Math.random() * 2 - 1) * 0.5,
    y: (Math.random() * 2 - 1) * 0.5,
  }));
  const [rotation, setRotation] = useState(Math.random() * 360);
  const [scale, setScale] = useState(() => {
    const baseScale = 0.4 + Math.random() * 0.3; // Increased base scale
    return Math.random() < 0.3 ? baseScale * 2 : baseScale; // 30% chance of being 1.5 times larger
  });

  const animateFloat = useCallback(() => {
    setPosition((prev) => ({
      x: prev.x + offset.x,
      y: prev.y + offset.y,
    }));
    setRotation((prev) => (prev + 0.05) % 360);
  }, [offset]);

  const throttledAnimateFloat = useThrottle(animateFloat, 50);

  useEffect(() => {
    const intervalId = setInterval(throttledAnimateFloat, 50);
    return () => clearInterval(intervalId);
  }, [throttledAnimateFloat]);

  const checkBounds = useCallback(() => {
    const newPosition = { ...position };
    let needsUpdate = false;

    if (position.x < -120) {
      newPosition.x = window.innerWidth + 120;
      needsUpdate = true;
    } else if (position.x > window.innerWidth + 120) {
      newPosition.x = -120;
      needsUpdate = true;
    }

    if (position.y < -120) {
      newPosition.y = window.innerHeight + 120;
      needsUpdate = true;
    } else if (position.y > window.innerHeight + 120) {
      newPosition.y = -120;
      needsUpdate = true;
    }

    if (needsUpdate) {
      setPosition(newPosition);
    }
  }, [position]);

  useEffect(() => {
    const boundsId = setInterval(checkBounds, 1000);
    return () => clearInterval(boundsId);
  }, [checkBounds]);

  return (
    <Card
      className="absolute shadow-lg overflow-hidden opacity-10 pointer-events-none"
      style={{
        width: `${10 * scale}rem`,
        height: `${15 * scale}rem`,
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        transition: "transform 1s ease-in-out",
      }}
    >
      <img
        src={card.image}
        alt={card.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </Card>
  );
});

FloatingCard.displayName = "FloatingCard";
