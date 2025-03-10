import WebSocket from 'ws';
import fetch from 'node-fetch';

//const wss = new WebSocket.Server({ port: 8080 });
const wss = new WebSocket ('wss://chess-api.com/v1');
console.log('WebSocket server is running on ws://localhost:8080');
// const ws = new WebSocket('wss://chess-api.com/v1');

wss.on('connection', (ws) => {
    console.log('New client connected');
    let gameId = ''; // Čuvanje ID-a partije

    ws.on('message', async (message) => {
        gameId = message; // Čuvanje ID-a koji je poslao klijent
        console.log(`Game ID set to: ${gameId}`);

        const interval = setInterval(async () => {
            try {
                console.log("ovo je server i primnio sam iD", gameId);
                const response = await fetch(`https://api.chess.com/pub/game/${gameId}/board`);
                const data = await response.json();

                if (data && data.fen) {
                    const fen = data.fen;
                    ws.send(fen); // Slanje FEN pozicije
                } else {
                    console.error('No FEN data found');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }, 2000); // Slanje svakih 2 sekunde

        ws.on('close', () => {
            clearInterval(interval);
            console.log('Client disconnected');
        });
    });
});
