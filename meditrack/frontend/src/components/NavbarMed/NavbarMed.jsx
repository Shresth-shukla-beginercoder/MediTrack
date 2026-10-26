
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import Brand from "./Brand";
import DesktopNavigation from "./DesktopNavigation";
import AccountActions from "./AccountActions";
import MobileNavigation from "./MobileNavigation";

export function NavbarMed() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, md: 76 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Brand />

          <DesktopNavigation />

          <AccountActions />

          <IconButton
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            sx={{
              display: { xs: "inline-flex", md: "none" },
              color: "primary.main",
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <MobileNavigation
        open={mobileOpen}
        onClose={closeMobileMenu}
      />
    </AppBar>
  );
}
