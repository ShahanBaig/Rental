import React from "react";
import { Box, Typography } from "@mui/material";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import { useTheme } from "@emotion/react";

const MessageBox = ({ message }) => {
  const theme = useTheme();
  const main = theme.palette.primary.main
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  return (
    <Box marginY="0.8rem" display="flex" alignItems="center" gap="0.5rem" backgroundColor={neutralLight}>
      <PriorityHighRoundedIcon />
      <Typography color={main} fontWeight="200" variant="h5">
        {message}
      </Typography>
    </Box>
  );
};

export default MessageBox;
