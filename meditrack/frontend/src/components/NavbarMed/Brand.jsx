
import { Box, Typography } from "@mui/material";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import { Link as RouterLink } from "react-router-dom";

export default function Brand() {
  return (
    <Box
      component={RouterLink}
      to="/"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: "primary.main",
        textDecoration: "none",
        flexShrink: 0,
      }}
    >
      <LocalHospitalOutlinedIcon sx={{ fontSize: 34 }} />

      <Typography
        component="span"
        variant="h5"
        sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}
      >
        MediTrack
      </Typography>
    </Box>
  );
}
