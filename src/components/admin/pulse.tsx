import React, { use } from 'react';

interface PulseDotProps {
  color: string;
  pulseRadius?: number; // Optional prop for customizing the pulse radius
}

const PulseDot: React.FC<PulseDotProps> = ({ color, pulseRadius = 15 }) => {
  const outerColor = `${color}33`; // Hex color code with 20% opacity

  const pulseSize = pulseRadius * 2;
  const pulseHalfSize = pulseRadius;

  return (
    <div className="relative flex items-center justify-center" style={{ width: pulseSize, height: pulseSize }}>
      <div
        className="absolute border-2 rounded-full animate-pulsate"
        style={{ borderColor: color, width: pulseSize, height: pulseSize }}
      />
      <div
        className="h-[10px] w-[10px] rounded-full flex items-center justify-center"
        style={{ backgroundColor: outerColor }}
      >
        <div
          className="h-[6px] w-[6px] rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default PulseDot;


// How to use
// <Pulse color="#4A4A4A" pulseRadius={5}/>