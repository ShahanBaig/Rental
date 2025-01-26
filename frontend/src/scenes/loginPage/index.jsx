import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import MessageBox from "../../components/general/MessageBox"
import { useSelector } from "react-redux";


const LoginPage = () => {
  const theme = useTheme();
  const main = theme.palette.primary.main
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { message } = useSelector((state) => state.persisted.user)

  
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Rental
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={primaryLight}
      >
        <Typography color={main} fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Rental, you will own nothing and be happy!
        </Typography>
        {message ? <MessageBox message={message} /> : null }
        <Form />
      </Box>
    </Box>
  )
};

export default LoginPage;
