import React, { useState, useEffect } from 'react';
import { useCountdown } from '../hooks/useCountdown';

interface FlipCardProps {
  value: string;
  nextValue: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ value, nextValue }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== currentValue) {
      setPreviousValue(currentValue);
      setCurrentValue(value);
      setIsFlipping(true);
      const timeout = setTimeout(() => setIsFlipping(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [value, currentValue]);
  
  const displayValue = isFlipping ? previousValue : currentValue;
  const displayNextValue = isFlipping ? currentValue : nextValue;

  return (
    <div className="flip-card font-orbitron font-black text-cyan-400">
      <div className="top">{displayValue}</div>
      <div className="bottom">{displayValue}</div>
      {isFlipping && <div className="top-flip top">{displayNextValue}</div>}
      {isFlipping && <div className="bottom-flip bottom">{displayNextValue}</div>}
    </div>
  );
};

interface CountdownProps {
  targetDate: string;
}

const CountdownItem = ({ value, label }: { value: number; label: string }) => {
    const stringValue = value.toString().padStart(2, '0');
    const prevValue = (value + 1).toString().padStart(2, '0');
    
    return (
        <div className="flex flex-col items-center">
            <div className="flex gap-1">
                <FlipCard value={stringValue[0]} nextValue={prevValue[0]} />
                <FlipCard value={stringValue[1]} nextValue={prevValue[1]} />
            </div>
            <span className="text-xs uppercase text-slate-400 tracking-widest mt-2">{label}</span>
        </div>
    );
};


const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    return <div className="text-3xl font-bold text-green-400 animate-pulse font-orbitron">The Hackathon is LIVE!</div>;
  }

  return (
    <div className="flex items-start space-x-4">
      <CountdownItem value={days} label="Days" />
      <span className="text-6xl font-orbitron text-slate-600">:</span>
      <CountdownItem value={hours} label="Hours" />
      <span className="text-6xl font-orbitron text-slate-600">:</span>
      <CountdownItem value={minutes} label="Minutes" />
      <span className="text-6xl font-orbitron text-slate-600">:</span>
      <CountdownItem value={seconds} label="Seconds" />
    </div>
  );
};

export default Countdown;