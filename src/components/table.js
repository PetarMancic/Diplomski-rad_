import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function SpanningTable({ moves }) {
  const totalMoves = moves.length-1;

  return (
    <TableContainer component={Paper} style={{ maxHeight: 400, minHeight:300 }}>
      {" "}
      {/* Set a fixed height for the table */}
      <Table sx={{}} aria-label="spanning table">
        <TableHead>
          <TableRow 
          style={{
            position: "sticky",
            top: 0,
            background: "white",
            zIndex: 1,
          }}>
            <TableCell
              align="center"
              style={{ fontSize: "18px", fontWeight: "bold", width: "20%" }}
            >
              Broj poteza
            </TableCell>
            <TableCell
              align="center"
              style={{ fontSize: "18px", fontWeight: "bold", width: "40%" }}
            >
              FEN
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {moves.map((move, index) => (
            <TableRow key={index}>
              <TableCell align="center">{index + 1}.</TableCell>
              <TableCell align="center">{move}</TableCell>
            </TableRow>
          ))}

          <TableRow
            style={{
              position: "sticky",
              bottom: 0,
              background: "white",
              zIndex: 1,
            }}
          >
            <TableCell rowSpan={1} />
            <TableCell
              colSpan={1}
              style={{ fontSize: "18px", fontWeight: "bold" }}
            >
              Ukupan broj poteza
            </TableCell>
            <TableCell
              align="center"
              style={{ fontSize: "18px", fontWeight: "bold" }}
            >
              {totalMoves}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
