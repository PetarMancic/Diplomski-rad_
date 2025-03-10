// GameContext.js
import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [isGameOver, setIsGameOver] = useState(false);
  const [closeSocket, setCloseSocket] = useState(() => () => {});

  return (
    <GameContext.Provider value={{ isGameOver, setIsGameOver, closeSocket, setCloseSocket }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  return useContext(GameContext);
};
