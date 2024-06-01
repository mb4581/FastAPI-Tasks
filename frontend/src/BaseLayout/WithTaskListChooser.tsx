import {Box, CircularProgress, Divider, Drawer, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import React from "react";
import {API_URL} from "../constants.ts";
import {TaskListIdProvider} from "./hooks.ts";
import {NewTaskListButton} from "./NewTaskListButton.tsx";

type TaskListRow = {id: number, name: string};

export function WithTaskListChooser(props: React.PropsWithChildren) {
  const [lists, setLists] = React.useState<TaskListRow[]>(null);
  const [listId, setListId] = React.useState<number>(null);

  React.useEffect(() => {
    if(lists != null) return;

    fetch(`${API_URL}/tasks/`, {
      credentials: "include"
    }).then((r) => {
      return r.json();
    }).then((d) => {
      if(listId == null && d.length > 0)
        setListId(d[0].id);
      setLists(d);
    })
  })

  return (
    <Box sx={{display: "flex"}} m={2} gap={2}>
      {lists === null ? <CircularProgress/> : <>
        <Box sx={{width: "400px"}}>
          <List>
            {lists.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton selected={listId == item.id} onClick={() => setListId(item.id)}>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <NewTaskListButton onComplete={() => setLists(null)} />
          </List>
        </Box>
        <Box sx={{flex: 1}}>
          <TaskListIdProvider.Provider value={listId}>
            {listId != null && props.children}
          </TaskListIdProvider.Provider>
        </Box>
      </>}
    </Box>
  )
}