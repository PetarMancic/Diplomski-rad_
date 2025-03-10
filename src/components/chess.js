import "./chess.css";
import React, { useState, useEffect } from "react";
import VremeIgraca from "./vremeIgraca";
import Chessboard from "chessboardjsx";


function Chess({
  blackName,
  whiteName,
  blackTime,
  whiteTime,
  setWhiteTime,
  setBlackTime,
  allFens,
  startCount,
  currentPlayer,
  blackColorSquare,
  whiteColorSquare,
}) {

  const [showPopup, setShowPopup] = useState(false);
  const [reason, setReason] = useState("");


  console.log(whiteTime, blackTime);



  const [finished, setFinished] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [isConnected, setIsConnected] = useState(false);

  const rowNumbers = [8, 7, 6, 5, 4, 3, 2, 1];
  const columnLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];


 

  function vremeUSekunde(vreme) {
    if (typeof vreme !== "string") {
      vreme = String(vreme); // Ili bacite grešku ili konvertujte u string
    }
    const [minuti, sekundi] = vreme.split(".").map(Number);
    return minuti * 60 + sekundi;
  }

  function sekundeUVreme(ukupnoSekunde) {
    const minuti = Math.floor(ukupnoSekunde / 60);
    const sekundi = ukupnoSekunde % 60;
    return `${minuti.toString().padStart(2, "0")}.${sekundi
      .toString()
      .padStart(2, "0")}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!finished && startCount) {
        // ovde je bilo && startCOund
        if (currentPlayer === "white") {
          // Ovaj deo se izvršava kada je beli igrač na potezu
          setWhiteTime((prevWhiteTime) => {
            // console.log("Prethodno belo vreme", prevWhiteTime);
            let newWhiteTimeINSeconds = vremeUSekunde(prevWhiteTime);
            newWhiteTimeINSeconds -= 1;
            let umanjenoZaStr = sekundeUVreme(newWhiteTimeINSeconds);
            // Proverite da li je vreme belog igrača postalo 0
            if (newWhiteTimeINSeconds === 0) {
              setReason("Pala zastavica,CRNI pobednik ");
              setShowPopup(true);
              //alert("Gotova partija!");
              setGameOver(true);
              localStorage.setItem("kraj", "true");
              console.log("Postavio sam da je kraj true");
            }
            return umanjenoZaStr;
          });
        } else {
          setBlackTime((prevBlackTime) => {
            let newBlackTimeINSeconds = vremeUSekunde(prevBlackTime);
            newBlackTimeINSeconds -= 1;
            let umanjenoZaStr = sekundeUVreme(newBlackTimeINSeconds);

            if (newBlackTimeINSeconds === 0) {
              setReason("Pala zastavica, BELI pobednik");
              setShowPopup(true);
              //alert("Gotova partija!");
              setGameOver(true);
              localStorage.setItem("kraj", "true");
            }
            console.log("chess.js postavlja black time na :", prevBlackTime);
            return umanjenoZaStr;
          });
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [currentPlayer, finished, startCount]); // dodajte startCount ako je relevantan





  const [screenSize, setScreenSize] = useState("350");

 
  useEffect(() => {
    // Funkcija za ažuriranje screenSize
    const updateScreenSize = () => {
      if (window.innerWidth > 1280) {
        console.log("upadam u update >1280");
        setScreenSize("600");
      } else {
        console.log("upadam u update <1280");
        setScreenSize("350");
      }
    };

    // Pozivamo funkciju odmah da postavimo inicijalnu vrednost
    updateScreenSize();

    // Dodajemo event listener za resize
    window.addEventListener('resize', updateScreenSize);
    
    // Čistimo event listener kada se komponenta unmountuje
    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  return (
    <div
      className="chess-board"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <div
        style={{ display: "flex", flexDirection: "row", width: "fit-content" }}
      >
        <BasicSelect boja={"crnih"} onSelectChange={BoardType}>
          {" "}
        </BasicSelect>
      </div> */}
      {/* <Chessboard position={fen} /> */}

      <div
        className="tabla"
        style={{
          padding: "30px",
          display: "inline-block",
          position: "relative",
          width: `${screenSize}px`,
        }}
      >
        <div
          className="divKojiSadrziDivImeCrnog"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "stretch",
            width: "100%",
            // backgroundColor: "blue",
            height: "8%",
            marginLeft: "10px",
          }}
        >
          <div
            className="imeCrnog"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "red",
              border:
                currentPlayer == "black" ? "2px solid red" : "2px solid black",
              width: "20%",
              padding: "20px",
              fontSize: "18px",
            }}
          >
            {blackName}
          </div>

          <VremeIgraca
            //time={pretvoriUMinSec(blackTime)}
            time={blackTime}
            style={{
              //backgroundColor: "green",
              padding: "10px",
              border: "2px solid black", // Okvir
              border: currentPlayer == "black" ? "2px solid red" : "2px solid ",
              borderRadius: "5px", // Zaokruženi uglovi
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            {/* Vreme se prikazuje ovde */}
          </VremeIgraca>
        </div>

        <Chessboard
          darkSquareStyle={{ backgroundColor: blackColorSquare }}
          lightSquareStyle={{ backgroundColor: whiteColorSquare }}
          /// position={fen}
          position={allFens[allFens.length - 1]}
          width={screenSize}
        />
        {}
        <div
          className="slova"
          style={{
            display: "flex",
            justifyContent: "center",

            width: `${screenSize}px`,
            //border: "2px solid black",
          }}
        >
          {columnLetters.map((letter, index) => (
            <span
              style={{
                display: "inline-block", // Ili "block"
                flex: "1",
                textAlign: "center",
                fontSize: "25px",
                color: "black",
                fontWeight: "bold",
                width: "100%",
              }}
              key={index}
            >
              {letter}
            </span>
          ))}
        </div>

        <div
          className="divKojiSadrziDivImeCrnog"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "stretch",
            width: "100%",
            // backgroundColor: "blue",
            height: "8%",
            marginLeft: "10px",
          }}
        >
          <div
            className="imeBelog"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              //  backgroundColor: "pink",
              border:
                currentPlayer == "white" ? "2px solid red" : "2px solid black",
              width: "20%",
              padding: "20px",
              fontSize: "18px",
            }}
          >
            {whiteName}
          </div>

          <VremeIgraca
            //time={pretvoriUMinSec(whiteTime)}
            time={whiteTime}
            style={{
              //backgroundColor: "green",
              display: "flex",
              padding: "10px",
              border:
                currentPlayer == "white" ? "2px solid red" : "2px solid black",
              borderRadius: "5px", // Zaokruženi uglovi
              width: "20%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Vreme se prikazuje ovde */}
          </VremeIgraca>
        </div>

        <div
          className="brojevi"
          style={{
            position: "absolute",
            top: "12%",
            right: "0",
            height: `${screenSize}px`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            // border: "2px solid black",
          }}
        >
          {rowNumbers.map((number, index) => (
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontSize: "25px",
                color: "black",
                fontWeight: "bold",
                width: "100%",
                maxHeight: "100%",
                height: "100%",
              }}
              key={index}
            >
              {number}
            </span>
          ))}
        </div>
      </div>

      <div
        className="ispodTable"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* <div className="strelice" style={{ display: "flex", gap: "10px" }}>
          <IconButtonWithTooltip
            title="pocetak"
            IconComponent={KeyboardDoubleArrowLeftOutlinedIcon}
            onClick={() => EndOrFinishHandler("pocetak")}
          />

          <IconButtonWithTooltip
            title="nazad"
            IconComponent={ArrowBackIcon}
            onClick={() => indexHandler(-1)}
          />

          <IconButtonWithTooltip
            title="napred"
            IconComponent={ArrowForwardIcon}
            onClick={() => indexHandler(1)}
          />

          <IconButtonWithTooltip
            title="kraj"
            IconComponent={KeyboardDoubleArrowRightOutlinedIcon}
            onClick={() => EndOrFinishHandler("kraj")}
          />
        </div> */}

        {/* {showPopup && (
          <Popup reason={reason} onClose={() => setShowPopup(false)}>
            {" "}
          </Popup>
        )} */}
      </div>
    </div>
  );
}

export default Chess;
