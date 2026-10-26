
import { Box, Container, Stack } from "@mui/material";

import FooterBrand from "./FooterBrand.jsx";
import FooterLinks from "./FooterLinks.jsx";
import FooterBottom from "./FooterBottom.jsx";

function FooterMed() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0B1F33",
        color: "#FFFFFF",
        mt: "auto",
        py: 5,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={3}
        >
          <FooterBrand />
          <FooterLinks />
        </Stack>

        <FooterBottom />
      </Container>
    </Box>
  );
}

export default FooterMed;
