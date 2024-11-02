import React, { useState, useEffect } from 'react';
import '../styles/Home.css'; // Import your CSS file

function Home() {
  const [isPumpMoving, setIsPumpMoving] = useState(false);
  const [isHandleMoving, setIsHandleMoving] = useState(false);
  const [isCompressorMoving, setIsCompressorMoving] = useState(false);
  const [balloons, setBalloons] = useState([]); // Array to hold balloon properties
  const [clickCount, setClickCount] = useState(0);

  const balloonColors = [
    "/images/balloon_red.png", "/images/balloon_blue.png", "/images/balloon_green.png",
    "/images/balloon_yellow.png", "/images/balloon_purple.png", "/images/balloon_orange.png",
    "/images/balloon_pink.png", "/images/balloon_lemon.png", "/images/balloon_skyblue.png",
    "/images/balloon_magenta.png"
  ];

  const letterImages = [
    "/images/A.png", "/images/B.png", "/images/C.png", "/images/D.png",
    "/images/E.png", "/images/F.png", "/images/G.png", "/images/H.png",
    "/images/I.png", "/images/J.png", "/images/K.png", "/images/L.png",
    "/images/M.png", "/images/N.png", "/images/O.png", "/images/P.png",
    "/images/Q.png", "/images/R.png", "/images/S.png", "/images/T.png",
    "/images/U.png", "/images/V.png", "/images/W.png", "/images/X.png",
    "/images/Y.png", "/images/Z.png"
  ];

  const handlePumpClick = () => {
    setIsPumpMoving(true);
    setIsHandleMoving(true);
    setIsCompressorMoving(true);

    setBalloons(prevBalloons => {
      // Update the size of the current balloon
      const newBalloons = [...prevBalloons];
      const currentBalloon = newBalloons[newBalloons.length - 1];
      if (currentBalloon) {
        const newSize = Math.min(currentBalloon.size + 30, 200);
        const sizeDifference = newSize - currentBalloon.size; // Calculate size difference
        
        // Update balloon size
        currentBalloon.size = newSize;
        
        // Move the balloon upward based on the size increase
        currentBalloon.position = {
          top: currentBalloon.position.top - (sizeDifference / 10), // Adjust upward
          left: currentBalloon.position.left,
        };
      }
      return newBalloons;
    });

    setClickCount(prevCount => {
      const newCount = prevCount + 1;
      if (newCount === 3) {
        // Add a new balloon after 3 clicks
        addNewBalloon();
        setClickCount(0);
      }
      return newCount;
    });

    setTimeout(() => {
      setIsPumpMoving(false);
      setIsHandleMoving(false);
      setIsCompressorMoving(false);
    }, 300);
  };

  const addNewBalloon = () => {
    const newBalloon = {
      color: balloonColors[balloons.length % balloonColors.length],
      letter: letterImages[balloons.length % letterImages.length],
      size: 50,
      position: { top: 65, left: 76 },
      isFlying: false,
      isBurst: false,
    };
    
    setBalloons(prevBalloons => {
      // Check if the balloon with the same letter already exists in the state
      const balloonExists = prevBalloons.some(b => b.letter === newBalloon.letter);
      if (!balloonExists) {
        return [...prevBalloons, newBalloon];
      }
      // If the balloon already exists, return the previous state
      return prevBalloons;
    });
  };
  
  useEffect(() => {
    // Start with one balloon
    if (balloons.length === 0) {
      addNewBalloon();
    }

    // Handle flying logic for each balloon
    balloons.forEach((balloon, index) => {
      if (balloon.size >= 200 && !balloon.isBurst && !balloon.isFlying) {
        const updatedBalloons = [...balloons];
        updatedBalloons[index].isFlying = true;

        const flyInterval = setInterval(() => {
          setBalloons(prevBalloons => {
            const newBalloons = [...prevBalloons];
            // Update the balloon's position for smooth flying
            if (newBalloons[index].position.top > 0) {
              newBalloons[index].position.top -= 0.5; // Move upward consistently
            } 
            if (newBalloons[index].position.left > 0) {
              newBalloons[index].position.left -= 0.5;
            }else {
              // Once the balloon reaches the top, mark it as burst
              newBalloons[index].isBurst = true;
              newBalloons[index].isFlying = false;
              clearInterval(flyInterval);
            }
  
            return newBalloons;
          });
        }, 50);

        const flyTimeout = setTimeout(() => {
          clearInterval(flyInterval);
          setBalloons(prevBalloons => {
            const newBalloons = [...prevBalloons];
            newBalloons[index].isBurst = true;
            newBalloons[index].isFlying = false;
            return newBalloons;
          });
        }, 2500);

        return () => {
          clearInterval(flyInterval);
          clearTimeout(flyTimeout);
        };
      }
    });
  }, [balloons]);

  return (
    <div className="container">
      <div className="pumpContainer" onClick={handlePumpClick}>
        <img src="/images/pump_body.png" alt="Pump" width={350} height={350}
          className={`pump ${isPumpMoving ? 'pumpUp' : ''}`} />
        <img src="/images/pump_handle.png" alt="Pump Handle" width={300} height={350}
          className={`handle ${isHandleMoving ? 'handleDown' : ''}`} />
        <img src="/images/compressor.png" alt="Compressor" width={350} height={350}
          className={`compressor ${isCompressorMoving ? 'compressorUp' : ''}`} />
      </div>
      {balloons.map((balloon, index) => (
        <React.Fragment key={index}>
          <img src={balloon.color} alt="Balloon"
            width={balloon.isBurst ? 0 : balloon.size} height={balloon.isBurst ? 0 : balloon.size}
            className="balloon"
            style={{
              position: 'absolute',
              top: `${balloon.position.top}%`,
              left: `${balloon.position.left}%`,
              opacity: balloon.isBurst ? 0 : 1,
              transition: 'width 0.5s ease, height 0.5s ease, opacity 0.5s ease',
            }} />
          {!balloon.isBurst && (
            <img src={balloon.letter} alt={`Letter ${String.fromCharCode(65 + index)}`}
              width={balloon.size / 2} height={balloon.size / 2}
              style={{
                position: 'absolute',
                top: `${balloon.position.top + balloon.size / 50}%`,
                left: `${balloon.position.left + balloon.size / 50}%`,
                transform: 'translate(-50%)',
                opacity: 1,
                transition: 'opacity 0.5s ease',
              }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Home;
