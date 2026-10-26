
import { Box, Stack, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function FooterBrand() {
  return (
    <Box sx={{ maxWidth: 380 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ mb: 1 }}
      >
        <FavoriteBorderIcon
          sx={{ color: "#55C2D1", fontSize: 30 }}
        />

        <Typography variant="h5" fontWeight={700}>
          MediTrack
        </Typography>
      </Stack>

      <Typography
        variant="body2"
        sx={{ color: "#C5D4E2", lineHeight: 1.8 }}
      >
        Helping you stay organized with your medication
        instructions and schedules.
      </Typography>
    </Box>
  );
}

export default FooterBrand;
