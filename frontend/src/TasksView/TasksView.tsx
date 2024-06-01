import {useTaskListId} from "../BaseLayout";
import React from "react";
import {API_URL} from "../constants.ts";
import {Box, Card, CardContent, LinearProgress, List, TextField, Typography} from "@mui/material";
import {NewTaskForm} from "./NewTaskForm.tsx";
import {TaskRow} from "./TaskRow.tsx";

export type TaskItem = {
  id: number,
  title: string,
  completed: boolean,
}

export function TasksView() {
  const listId = useTaskListId();
  const [tasks, setTasks] = React.useState<TaskItem[]>(null);
  const [rfTrigger, setRfTrigger] = React.useState<number>(0);

  React.useEffect(() => {
    if(listId == null) return;
    setTasks(null);

    fetch(`${API_URL}/tasks/${listId}/`, {
      credentials: "include"
    }).then((r) => {
      return r.json();
    }).then((d) => {
      setTasks(d.items);
    })
  }, [listId, rfTrigger]);

  if(tasks == null)
    return <LinearProgress />

  return (
    <Box gap={2} sx={{display: "flex", flexDirection: "column"}}>
      {/* Да это костыль, мне пофиг */}
      <NewTaskForm onComplete={() => setRfTrigger(Math.random())} />
      <Card>
        <List>
          {tasks.map((item) => (
            <TaskRow {...item} key={item.id} onComplete={() => setRfTrigger(Math.random())} />
          ))}
        </List>
      </Card>
    </Box>
  )
}
