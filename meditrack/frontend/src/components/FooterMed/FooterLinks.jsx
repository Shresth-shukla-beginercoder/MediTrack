
import { Box, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const footerLinks = [
  { label: "Home", path: "/" },
  { label: "Medical Instructions", path: "/instructions" },
  { label: "User Login", path: "/user/login" },
  { label: "Create Account", path: "/user/register" },
  { label: "Doctor Login", path: "/doctor/login" },
];

function FooterLinks() {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Quick Links
      </Typography>

      <Stack spacing={1}>
        {footerLinks.map((link) => (
          <Typography
            key={link.path}
            component={RouterLink}
            to={link.path}
            sx={{
              color: "#C5D4E2",
              textDecoration: "none",
              fontSize: 14,
              "&:hover": {
                color: "#55C2D1",
              },
            }}
          >
            {link.label}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

export default FooterLinks;

