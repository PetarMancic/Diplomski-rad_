import React from "react";
import "./popup.css";
import { Button } from "@mui/material";

const Popup = ({ reason, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <img
          src="../chess-board.png"
          style={{ width: "30%", height: "30%", marginTop: "-20%" }}
        ></img>

        <h2>Partija je zavrsena!</h2>
        <h4>{reason}</h4>
        <Button variant="contained" color="success" onClick={onClose}>
          {" "}
          Ok
        </Button>
      </div>
    </div>
  );
};

export default Popup;
