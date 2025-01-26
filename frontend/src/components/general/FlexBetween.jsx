import { Box } from "@mui/material"; // div but designed to work well with MUI's styling system.
import { styled } from "@mui/system"; // A utility from MUI's @mui/system package, used to create custom styled components by applying CSS styles.

const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;
