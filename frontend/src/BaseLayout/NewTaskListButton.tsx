import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent, DialogContentText,
  DialogTitle,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField
} from "@mui/material";
import {API_URL} from "../constants.ts";

export function NewTaskListButton(props: {onComplete: () => any}) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [name, setName] = React.useState<string>("");

  function process() {
    fetch(`${API_URL}/tasks/`, {
      credentials: "include",
      method: "PUT",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        name,
      })
    }).then(() => {
      setOpen(false);
      setName("");
      props.onComplete();
    })
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setOpen(true)}>
          <ListItemText primary="Создать список" />
        </ListItemButton>
      </ListItem>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>Создать список</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Введите название нового списка дел.
          </DialogContentText>
          <br/>
          <TextField
            fullWidth
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Название"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={process}>Создать</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}