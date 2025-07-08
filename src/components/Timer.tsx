import React, { useEffect, useState } from 'react';

type TimerProps = {
  currentTime: string;
};

const Timer: React.FC<TimerProps> = ({ currentTime }) => {
  const [displayTime, setDisplayTime] = useState(currentTime);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (displayTime !== currentTime) {
      setAnimate(true);
      setTimeout(() => {
        setDisplayTime(currentTime);
        setAnimate(false);
      }, 180);
    }
  }, [currentTime, displayTime]);

  return (
    <div className="w-full flex justify-center mb-2">
      <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 px-4 py-2 text-2xl font-mono font-semibold tracking-widest text-neutral-800 shadow-sm text-center relative min-w-[96px] transition-all duration-200">
        <span className={animate ? 'inline-block transition-all duration-200 ease-in animate-timer-change' : ''}>
          {displayTime}
        </span>
        <style>{`
          @keyframes timerChange {
            0% { opacity: 0; transform: scale(0.95) translateY(8px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-timer-change {
            animation: timerChange 0.18s cubic-bezier(.22,1,.36,1);
          }
        `}</style>
      </div>
    </div>
  );
};

export default Timer; 