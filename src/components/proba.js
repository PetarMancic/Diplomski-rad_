import React, { useState, useEffect } from 'react';

const ElementPoElement = () => {
  const elementi = ['Prvi element', 'Drugi element', 'Treći element', 'Četvrti element'];
  const [trenutniIndeks, setTrenutniIndeks] = useState(0);
  const [startovano, setStartovano] = useState(false); // Drži da li je tajmer startovan

  useEffect(() => {
    let interval;

    // Pokreni interval samo ako je startovano
    if (startovano) {
      interval = setInterval(() => {
        setTrenutniIndeks((trenutniIndeks) => 
          trenutniIndeks < elementi.length - 1 ? trenutniIndeks + 1 : 0
        );
      }, 2000); // Na svakih 2 sekunde
    }

    // Očisti interval kada se komponenta unmount-uje ili kada se zaustavi
    return () => clearInterval(interval);
  }, [startovano]); // Ponovo pokreni efekt samo kada se `startovano` promeni

  // Funkcija za pokretanje i zaustavljanje intervala
  const startStop = () => {
    setStartovano(!startovano); // Menjaj stanje između pokretanja i zaustavljanja
  };

  return (
    <div>
      {/* Prikazuje trenutni element */}
      <h2>{elementi[trenutniIndeks]}</h2>
      
      {/* Dugme za pokretanje/zaustavljanje automatskog prelaska */}
      <button onClick={startStop}>
        {startovano ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

export default ElementPoElement;
