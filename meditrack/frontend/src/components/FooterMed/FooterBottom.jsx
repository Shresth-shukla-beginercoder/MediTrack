
import { Box, Typography } from "@mui/material";

function FooterBottom() {
  return (
    <Box
      sx={{
        borderTop: "1px solid #30475C",
        mt: 4,
        pt: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="body2" sx={{ color: "#C5D4E2" }}>
        © {new Date().getFullYear()} MediTrack. All rights reserved.
      </Typography>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          color: "#91A6B8",
          mt: 1,
        }}
      >
        For informational purposes. Follow your healthcare
        professional's instructions.
      </Typography>
    </Box>
  );
}

export default FooterBottom;
