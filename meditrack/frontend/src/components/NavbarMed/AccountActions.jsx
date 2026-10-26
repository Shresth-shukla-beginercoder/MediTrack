
import { Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function AccountActions() {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        gap: 1,
      }}
    >
      <Button
        component={RouterLink}
        to="/user/login"
        sx={{
          color: "primary.main",
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        User Login
      </Button>

      <Button
        component={RouterLink}
        to="/user/register"
        variant="contained"
        disableElevation
        sx={{
          fontWeight: 700,
          textTransform: "none",
          borderRadius: 2,
          px: 2,
        }}
      >
        Register
      </Button>

      <Button
        component={RouterLink}
        to="/doctor/login"
        variant="outlined"
        sx={{
          fontWeight: 700,
          textTransform: "none",
          borderRadius: 2,
        }}
      >
        Doctor Login
      </Button>
    </Box>
  );
}
