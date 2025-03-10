import { useEffect, useRef, useState } from "react";
import SpanningTable from "./table";

const Moves = ({moves}) => {
  

  return (
    <>
      <SpanningTable moves={moves} >
        {" "}
      </SpanningTable>
    </>
  );
};

export default Moves;
