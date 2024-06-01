import {TaskItem} from "./TasksView.tsx";
import {Checkbox, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {API_URL} from "../constants.ts";
import {useTaskListId} from "../BaseLayout";

export function TaskRow(props: TaskItem & {onComplete: () => any}) {
  const listId = useTaskListId();

  function process() {
    if(props.completed) return;

    fetch(`${API_URL}/tasks/${listId}/${props.id}`, {
      credentials: "include",
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        completed: true,
      })
    }).then(() => {
      props.onComplete();
    })
  }

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={process}>
        <ListItemIcon>
          <Checkbox checked={props.completed} />
        </ListItemIcon>
        <ListItemText
          primary={props.title}
          sx={props.completed ? {
            textDecoration: "line-through",
            opacity: 0.5,
          } : {}}
        />
      </ListItemButton>
    </ListItem>
  )
}