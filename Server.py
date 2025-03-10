import asyncio
import websockets
import chess
import random
import datetime 
import random 
import json
import socket
import time

class WebSocketServer:
    def __init__(self):
        self.clients = set()
        self.board = chess.Board()
        self.whitePlayerName="Petar Mancic"
        self.blackPlayerName="Uros Zivkovic"
        self.timeLimit=300
        self.whiteTimeRemaining =100
        self.blackTimeRemaining = 100
        self.start_time = datetime.datetime.now()
        self.current_player = True
        self.counter=0
        self.fens=[]
        self.pgns=[]
        self.previuosFen=""
        self.newFen=""
        
        
        
       

    # async def handler(self, websocket, path):
    #     # Dodaj klijenta na listu aktivnih klijenata
    #     self.clients.add(websocket)
    #     print(f"Klijent se povezao. Trenutni klijenti: {len(self.clients)}")

    #     try:
    #         # Čekaj na poruke ili konekcije
    #         while True:
    #             await asyncio.sleep(1)  # Održava konekciju aktivnom
    #     except websockets.exceptions.ConnectionClosed:
    #         print("Klijent je zatvorio vezu.")
    #     finally:
    #         self.clients.remove(websocket)  # Ukloni klijenta iz skupa kada se veza zatvori
    #         print(f"Klijent se odjavio. Trenutni klijenti: {len(self.clients)}")


    async def broadcast(self, message):
        for client in self.clients:
            if client.open:
                await client.send(message)



 
    def pretvori_u_min_sec(self,sekunde):
        minutes = sekunde // 60
        remaining_seconds = sekunde % 60
        formatted_seconds = f"{remaining_seconds:02}"  # formatira tako da dodaje nulu ispred ako je potrebno
        return f"{minutes}:{formatted_seconds}"

    # async def game_loop(self):
    #     while not self.board.is_game_over():

    #         # Iz liste legalnih poteza izabere jedan 
    #         legalNextMove = random.choice(list(self.board.legal_moves))
    #         # PGN
    #         pgn = str(legalNextMove)
    #         self.pgns.append(pgn)
    #         # Odigraj potez 
    #         self.board.push(legalNextMove)  # Odigraj potez tj stavi na tablu 
    #         # FEN
    #         fen = self.board.fen()  # Uzmi fen trenutnog stanja table 
    #         self.fens.append(fen)
    #         validnostTuple=(self.validate_fen(fen))
    #         if not validnostTuple[0]:
    #             print(validnostTuple[1]) # razlog
    #             break
    #         else:
    #              print("validan je FEN")

    #         print(fen)
    #         randomBroj = random.randint(4, 10)
    #         await asyncio.sleep(randomBroj)  # Ovde igrač razmišlja 
    #         # print(self.current_player)
    #         # print(self.blackTimeRemaining,randomBroj)
    #         # print(self.whiteTimeRemaining,randomBroj)
    #         if  self.current_player :
    #             self.whiteTimeRemaining = max(self.whiteTimeRemaining-randomBroj,0)
    #             # if(self.whiteTimeRemaining==0):
    #             #     break
                
    #         else:
    #             self.blackTimeRemaining = max(self.blackTimeRemaining-randomBroj,0)
    #             # if(self.blackTimeRemaining==0):
    #             #     break

            
    #         message_obj = {
    #             "fen": fen,
    #             "white_player": self.whitePlayerName,
    #             "black_player": self.blackPlayerName,
    #             "pgn": pgn,
    #             "whiteTime": self.whiteTimeRemaining,
    #             "blackTime": self.blackTimeRemaining,
    #             "currentPlayer":self.current_player,

    #             "fens":self.fens,
    #             "pgns":self.pgns
    #         }
            
    #         # print(self.pretvori_u_min_sec(message_obj["whiteTime"]))
    #         # print(self.pretvori_u_min_sec(message_obj["blackTime"]))
            
    #         await self.broadcast(json.dumps(message_obj))

            
    #         # print(message_obj)
    #         # print("Move je oblika:", legalNextMove, "Pgn je oblika", pgn, " fen je", fen,  )
            
    #         # print("sada je potez odigrao beli a sledeci je crni" if self.current_player else "potez je odigrao crni a sad ce beli ")
 

    #         # print(self.counter)
    #         self.current_player = not self.current_player
    #        # print("____________________________")

    #     reason = self.get_game_result_reason()
    #     #print(reason)
    #     end_message = {"end": "kraj", "reason": reason}
    #     await self.broadcast(json.dumps(end_message))
       
        
    #     print("Igra je završena.")
    def parsiraj_poziciju(self, i):
        delovi = i.split(' ')
        fen = ' '.join(delovi[:6]) 

        dodatni_info = ' '.join(delovi[6:])
        parovi = dodatni_info.split('#')[1:]
        dodatni_info = {}
     
        for p in parovi[:-1]:  
            kljuc, vrednost = p.split('=')
            dodatni_info[kljuc.strip()] = vrednost.strip()
     
        trenutni_igrac = parovi[-1].strip()

        return fen, dodatni_info, 'white' if trenutni_igrac == 'W' else 'black'



    async def game_loop(self,putanjaDoDirektorijuma):
        while True:
            with open(putanjaDoDirektorijuma, 'r') as file: #otvaramo  direktorijum za citanje
             sadrzaj=file.readline()
             fen, dodatni_info, currentPlayer = self.parsiraj_poziciju(sadrzaj) #parsiranje stringa nakon citanja iz fajla 
             whiteName=dodatni_info["WhiteName"]
             blackName=dodatni_info["BlackName"]
             whiteTime=dodatni_info["WhiteTime"]
             blackTime=dodatni_info["BlackTime"]

             self.newFen=fen

             

            
             
            validnostTuple=(self.validate_fen(fen))

            if not validnostTuple[0]:
                print(validnostTuple[1]) 
                break
            else:
                print("validan je FEN")

            if( not self.newFen== self.previuosFen):
                self.fens.append(fen)

           
            
            await asyncio.sleep(1)  
           

            
            message_obj = {
                "fen": fen,
                "white_player": whiteName,
                "black_player": blackName,
                
                "whiteTime": whiteTime,
                "blackTime": blackTime,
                "currentPlayer":currentPlayer,

                "fens":self.fens,
            }
                
            
            
            

            if(self.newFen== self.previuosFen):
                 #print("ne radimo nista jer je fen isti")
                 continue
                 
                 #ovde treba da se vratimo gore na pocetak true 
            else:
                 await self.broadcast(json.dumps(message_obj))

            #await self.broadcast(json.dumps(message_obj))
            

            self.previuosFen=fen
           
 

           
            self.current_player = not self.current_player
            print("____________________________")

        reason = self.get_game_result_reason()
        #print(reason)
        end_message = {"end": "kraj", "reason": reason}
        await self.broadcast(json.dumps(end_message))
       
        
        print("Igra je završena.")
   

    

     


    def get_game_result_reason(self):
        if self.board.is_checkmate():
            return "Šah-mat"
        elif self.board.is_stalemate():
            return "Remi (stalemate)"
        elif self.board.is_insufficient_material():
            return "Remi (nedovoljno materijala)"
        elif self.board.is_seventyfive_moves():
            return "Remi (75 poteza)"
        elif self.board.is_fivefold_repetition():
            return "Remi (pet puta ponovljen)"
        elif self.board.is_variant_draw():
            return "Remi (varijanta) "
        else:
            return "Neodređeno"
        
    
    async def handler(self, websocket, path):
         # Dodaj klijenta na listu aktivnih klijenata
        self.clients.add(websocket)
        print(f"Klijent se povezao. Trenutni klijenti: {len(self.clients)}")

        # Osigurajte da se klijent ukloni iz skupa kada veza završi
        try:
            await self.listen_to_client(websocket)
        finally:
            self.clients.remove(websocket)  # Ukloni klijenta iz skupa kada se veza zatvori
            #print(f"Klijent se odjavio. Trenutni klijenti: {len(self.clients)}")

    
    async def listen_to_client(self, websocket):
        # Održavajte vezu sa klijentom
        while True:
            try:
                message = await websocket.recv()  # Čekamo poruku od klijenta
                if message == "shutdown":  # Proveravamo da li je poruka za gašenje servera
                    await self.broadcast(json.dumps({"end": "Server se gasi."}))
                   # print("Server se gaši na zahtev klijenta.")
                    break  # Prekida loop da se server ugasi
                # Ostala logika za obradu poruka
            except websockets.exceptions.ConnectionClosed:
                print("Klijent je zatvorio vezu.")
                break

    def validatePosition(self,position):
        rows = position.split("/")
        if len(rows) != 8:
            return False, "Greška: Nepravilna dužina pozicije figura. Treba da bude 8 redova."

        for row in rows:
            total_fields = 0
            for char in row:
                if char.isdigit():
                    total_fields += int(char)
                elif char in "rnbqkpRNBQKP":
                    total_fields += 1
                else:
                    return False, "Greška: Nepoznat simbol figura."
            
            if total_fields != 8:
                return False, "Greška: Ukupan broj polja u redu nije 8."

        return True, "Pozicija figura je validna."
    
    def validate_active_player(self,active_player):
        if active_player not in ['w', 'b']:
            return False, "Greška: Nepoznat aktivni igrač."
        return True, "Aktivni igrač je validan."
    
    def validate_castling_options(self,castling_options):
        if not all(c in "KQkq-" for c in castling_options):
            return False, "Greška: Nepoznat simbol rokiranja."
        return True, "Opcije rokiranja su validne."

    def validate_en_passant(self,en_passant):
        # Proverava format en passant
        if en_passant == '-':
            return True, "En passant je validan."
        if len(en_passant) != 2 or not en_passant[0].isalpha() or not en_passant[1].isdigit():
            return False, "Greška: Nepoznat format za en passant."
    
        file = en_passant[0]
        rank = int(en_passant[1])
        if file not in 'abcdefgh' or rank < 1 or rank > 8:
            return False, "Greška: Nepoznata polja za en passant."
        return True, "En passant je validan."
        
    def validate_move_count(self,move_count):
        if not move_count.isdigit() or int(move_count) < 0:
            return False, "Greška: Nepravilno broj poteza."
        return True, "Broj poteza je validan."

    def validate_total_count(self,total_count):
        if not total_count.isdigit() or int(total_count) <= 0:
            return False, "Greška: Nepravilno ukupan broj poteza."
        return True, "Ukupan broj poteza je validan."





    def validate_fen(self,fen):
        segments = fen.split(" ")
        if len(segments) != 6:
            return "Greška: Nepotpuni FEN string."

        position, active_player, castling_options, en_passant, move_count, total_count = segments
        
        # Proveravamo sve delove FEN-a
        validators = [
            self.validatePosition(position),
            self.validate_active_player(active_player),
            self.validate_castling_options(castling_options),
            self.validate_en_passant(en_passant),
            self.validate_move_count(move_count),
            self.validate_total_count(total_count)
        ]

       # print("Proveravamo da li je fen validan")
        
        # Prikazujemo rezultate provere
        for ispravnost,poruka in validators:
            if not ispravnost:
               return False,poruka
            
        
        return "FEN je validan!"




    def get_local_ip(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            # We use a random external address here (doesn't have to be reachable)
            s.connect(('8.8.8.8', 80))
            local_ip = s.getsockname()[0]
        finally:
            s.close()
        return local_ip




    async def main(self):
       

        localIP=self.get_local_ip() # pozivanje metoda koja ce vratiti adresu na kojoj je pokrenut server
        
    
        server = await websockets.serve(self.handler, "0.0.0.0", 8080)
        print(f"  \n WebSocket server je pokrenut na ",localIP, "adresi")
        asyncio.create_task(self.game_loop("C:/FAX/DIPLOMSKI/kontrolni_fajl.txt")) #pozivanje gameLoop metode koja vrsi citanje iz 
                                                                                    # kontrolnog ASCII fajla
        await server.wait_closed()



    def citajSadrzajIzDirektorijuma(putanja):
   
        with open(putanja, 'r') as file:
            while True:
                sadrzaj=file.readline()
                return(sadrzaj)
                
           
            
        
            
        
            
    

if __name__ == "__main__":
    server = WebSocketServer() #instanciranje objekta klase WebSocketServer
    asyncio.run(server.main()) #pozivanje glavne metode 
       

       
   # Test primer
   


       
