
import { Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const links = [
  { label: "Home", path: "/" },
  { label: "Medical Instructions", path: "/instructions" },
];

export default function DesktopNavigation() {
  return (
    <Box
      component="nav"
      aria-label="Main navigation"
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        gap: 1,
      }}
    >
      {links.map((item) => (
        <Button
          key={item.path}
          component={RouterLink}
          to={item.path}
          sx={{
            color: "text.primary",
            fontWeight: 600,
            textTransform: "none",
            px: 1.5,
            borderRadius: 2,
            "&:hover": {
              bgcolor: "primary.50",
              color: "primary.dark",
            },
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );
}
