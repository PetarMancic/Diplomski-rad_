import "./App.css";
import Chess from "./components/chess";
import Moves from "./components/moves";
import { GameProvider } from "./components/gameContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { TextField } from "@mui/material";
import BasicSelect from "./components/colorPicker";

function App() {
  const [ipAdress, setIpAddress] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [reason, setReason] = useState("");
  const [blackColorSquare, setBlackColorSquare] = useState("#8B4513");
  const [whiteColorSquare, setWhiteColorSquare] = useState("#F5DEB3");

  const [whiteName, setWhiteName] = useState("White player");
  const [blackName, setBlackName] = useState("Black player");
  const [blackTime, setBlackTime] = useState("black Time");
  const [whiteTime, setWhiteTime] = useState("white Time");
  const [currentPlayer, setCurrrentPlayer] = useState(false);

  const [allPgns, setAllPgns] = useState([]);
  const [allFens, setAllFens] = useState(["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]);

  const [finished, setFinished] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [startCount, setStartCount] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [fen, setFen] = useState("start"); // Početna FEN pozicija
  const [connected, setConnected] = useState(false);

  const socketRef = useRef(null);

  const address = useMemo(() => {
    if (ipAdress) {
      console.log(ipAdress);
      return `ws://${ipAdress}:8080`;
      //return 'ws://172.29.48.1:8080';
    }
    return null; // ili neka druga fallback vrednost
  }, [ipAdress]);

  const BoardType = (colorBlack, colorWhite) => {
    console.log("Picked color stampam iz chessa", colorBlack, colorWhite);
    setBlackColorSquare(colorBlack);
    setWhiteColorSquare(colorWhite);
  };

  const connectWebSocket = () => {
    // const address=`ws://${ipAdress}:8080`;
    console.log("adresa na koju ce se zakaciti je", address);

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    socketRef.current = new WebSocket(address);
    const socket = socketRef.current;

    socket.onopen = () => {
      console.log("Povezano na WebSocket server:", address);
      setIsConnected(true); // Označi da je veza otvorena
      setConnected(true);
    };

    let i = 0;
    socket.onmessage = (event) => {
      console.log("Ulazim u on.message ");
      const message = event.data;

      if (event.data.end == "kraj") {
        setGameOver(true);
      }
      try {
       
        const data = JSON.parse(message);
        console.log("data je oblika", data.blackTime);

        if (gameOver) {
          return;
        }

        setWhiteName(data.white_player);
        setBlackName(data.black_player);

        setWhiteTime(data.whiteTime);
        console.log("app.js postavlja black time", data.blackTime, data);
        if (data.blackTime != NaN) {
          setBlackTime(data.blackTime);
        }

        console.log(
          data.whiteTime,
          data.blackTime,
          data.white_player,
          data.black_player
        );

        // setAllPgns(data.pgns);
        setAllFens(data.fens);
        // console.log("svi fenovi su ",allFens)

        console.log("Ceo dataj je oblika  ", data);

        if (data.end === "kraj") {
          setShowPopup(true);
          setReason(data.reason);
          setFinished(true);
          return;
        }

        if (data.fen) {
          i++;

          setFen((prevFen) => {
            return data.fen;
          });

          setCurrrentPlayer(data.currentPlayer);
        }

        if (data.whitePlayer && data.blackPlayer) {
          console.log(
            `Igrači: ${data.white_player} (Beli), ${data.black_player} (Crni)`
          );
        }

        if (data.remaining_time !== undefined) {
          console.log(`Preostalo vreme: ${data.remaining_time} sekundi`);
          // Ovdje možeš dodati kod za upravljanje preostalim vremenom
        }
      } catch (error) {
        console.error("Greška pri parsiranju poruke:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket zatvoren");
      setShowPopup(true);
      setConnected(false);
      setFinished(true);
    };

    socket.onerror = (error) => {
      console.error("WebSocket greška:", error);
      setShowPopup(true);
      setConnected(false);
      setReason("Doslo je do greske na serveru!");
      setFinished(true);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        // Proverava da li je socket otvoren
        socket.close();
      }
    };
  };

  useEffect(() => {
    localStorage.clear();
    console.log("Local Storage je očišćen.");
  }, []);

  const petarHandler = () => {
    console.log("Kliknuto je ");
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Spreči osvežavanje stranice

    const form = event.target; // Pristupi formi
    const formData = new FormData(form); // Napravi FormData objekat

    // Izdvajanje vrednosti iz formData
    const myInput = formData.get("myInput"); // Dohvatanje vrednosti iz input polja
    const myCheckbox = formData.get("myCheckbox") === "on"; // Dohvatanje vrednosti iz checkbox-a

    setShowBoard(true);
    // Štampaj vrednosti u konzoli
    console.log("Text input:", myInput);
    setIpAddress(myInput);
    connectWebSocket();
    setStartCount(true);

    console.log("pozivam connect to web socket");
  };

  return (
    <GameProvider>
      <div className="spoljasnji">
        <div className="levi">
          <div
            className="ipAdresaIBojaTable"
            style={{
              //   display: "flex",
              //   flexDirection: "row",
              //   border: "1px solid black",
              //   marginLeft: "10px",
              //   height: "100px",
              //   padding: "10px",
              //   borderRadius: "5px",
              marginTop: "50px",
              //   padding: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "auto",

                alignItems: "center",
                justifyContent: "center",

                padding: "10px", // Možete dodati padding unutar ovog diva
                borderRadius: "5px", // Optional: round the corners
              }}
            >
              <BasicSelect boja={"crnih"} onSelectChange={BoardType}>
                {" "}
              </BasicSelect>
            </div>

            <form
              method="post"
              onSubmit={handleSubmit}
              style={{ marginTop: "10px" }}
            >
              <div
                className="Ip i crveno dugme"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center", // Centriranje sadržaja
                  padding: "15px",
                }}
              >
                <label style={{ marginRight: "10px" }}>
                  IP:
                  <input
                    name="myInput"
                    onChange={(e) => setIpAddress(e.target.value)}
                    style={{ marginRight: "8px" }} // Razmak između inputa i kružića
                  />
                </label>
                <div
                  className="red-circle"
                  style={{
                    backgroundColor: !connected ? "red" : "green",
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                  }} // Dodavanje dimenzija i oblika
                ></div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "", // Razmak između gumba i prethodnog sadržaja
                }}
              >
                <button
                  type="submit"
                  style={{
                    marginBottom: "10px",
                    // padding: "10px 15px",
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width:"100px",
                    height:"30px"
                  }}
                >
                  Povezi se
                </button>
              </div>
            </form>
          </div>

          <Chess
            blackName={blackName}
            whiteName={whiteName}
            blackTime={blackTime}
            whiteTime={whiteTime}
            setWhiteTime={setWhiteTime}
            setBlackTime={setBlackTime}
            allFens={allFens}
            startCount={startCount}
            currentPlayer={currentPlayer}
            blackColorSquare={blackColorSquare}
            whiteColorSquare={whiteColorSquare}
          />
        </div>

        <div className="desni">
          <Moves moves={allFens}> </Moves>
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
