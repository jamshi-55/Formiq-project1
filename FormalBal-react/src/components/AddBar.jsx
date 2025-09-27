
import React, { useState, useEffect } from 'react';

function AddBar() {
  const messages = [
    "WELCOME TO  FORMIQ ELEVATE YOUR EVERYDAY",
    "DISCOVER PREMIUM FORMAL WEAR FOR EVERY OCCASION",
    "ENJOY 30 % OFF YOUR FIRST PURCHASE ",
    "FORMIQ STYLE, ELEGANCE, AND QUALITY",
    "DRESS WELL , NOT TO IMPRESS, BUT TO EXPRESS CONFIDENCE AND RESPECT"
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => 
        (prevIndex + 1) % messages.length
      );
    }, 3000); 

    return () => clearInterval(interval); 
  }, [messages.length]);

  return (
    <div className="bg-teal-600 text-black text-center py-4 text-sm sticky top-0">
      {messages[currentMessageIndex]}
    </div>
  );
}

export default AddBar;
