import Tooltip from "@mui/material/Tooltip";

const IconButtonWithTooltip = ({ title, IconComponent, onClick }) => {
  return (
    <Tooltip title={title} arrow>
      <IconComponent
        style={{ fontSize: "36px", cursor: "pointer", }}
        onClick={onClick}
      />
    </Tooltip>
  );
};

export default IconButtonWithTooltip;
