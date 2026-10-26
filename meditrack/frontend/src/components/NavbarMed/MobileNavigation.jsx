
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const links = [
  { label: "Home", path: "/" },
  { label: "Medical Instructions", path: "/instructions" },
  { label: "User Login", path: "/user/login" },
  { label: "Register", path: "/user/register" },
  { label: "Doctor Login", path: "/doctor/login" },
];

export default function MobileNavigation({ open, onClose }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: 280, maxWidth: "85vw" },
        },
      }}
    >
      <Box
        component="nav"
        aria-label="Mobile navigation"
        sx={{ p: 2 }}
      >
        <List>
          {links.map((item, index) => (
            <Box key={item.path}>
              {index === 2 && <Divider sx={{ my: 1 }} />}

              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  onClick={onClose}
                  sx={{ borderRadius: 2 }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            </Box>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
