import {AppBar, Toolbar, Typography} from "@mui/material";
import React from "react";
import {useUserName} from "../LoginView";

export function AppHeader() {
  const userName = useUserName();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Список дел
        </Typography>
        <Typography variant="h6" component="div">
          {userName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
