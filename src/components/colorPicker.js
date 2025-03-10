import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect({ boja, onSelectChange }) {

  const validBoje = [
    "Braon",
    "Zelena",
    "Plava",
    "Roze",
    "Koral",
    "Ljubicasta",
    "Morska",
    "Seno",
    "Emerald",
  ];
  const [selectedBoja, setSelectedBoja] = React.useState(
    validBoje.includes(boja) ? boja : ""
  );

  const VrsteTable = {
    Braon: ["#f0d9b5", "#b58863"],
    Zelena: ["#eeeed2", "#769656"],
    Plava: ["#eae9d2", "#4b7399"],
    Roze: ["#ffffff", "#fcd8dd"],
    Koral: ["#B1E4B9", "#70A2A3"],
    Ljubicasta: ["#CCB7AE", "#706677"],
    Morska: ["#9DACFF", "#6F73D2"],
    Seno: ["#EAF0CE", "#BBBE64"],
    Emerald: ["#ADBD8F", "#6F8F72"],
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedBoja(selectedValue); // Ažurira izabranu boju u lokalnom stanju
    onSelectChange(VrsteTable[selectedValue][0], VrsteTable[selectedValue][1]);
  };

  return (
    <Box sx={{ minWidth: "175px", marginTop: "0px",display:"flex", alignItems:"center", justifyContent:"center"}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" sx={{ color: "black" }}>
          Izaberite boju table
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedBoja} // Postavljamo izabranu vrednost
          label="Izaberite boju kockica"
          onChange={handleChange}
          sx={{
            color: "black", // Boji samo polje
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                "& .MuiMenuItem-root": {
                  color: "black",
                  justifyContent: "center",
                },
              },
            },
          }}
        >
          {validBoje.map((boja) => (
            <MenuItem key={boja} value={boja}>
              {boja}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
