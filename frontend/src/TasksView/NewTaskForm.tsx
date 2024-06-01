import {Button, Card, CardContent, TextField} from "@mui/material";
import React from "react";
import {API_URL} from "../constants.ts";
import {useTaskListId} from "../BaseLayout";

export function NewTaskForm(props: {onComplete: () => any}) {
  const listId = useTaskListId();
  const [text, setText] = React.useState<string>("");

  function process() {
    fetch(`${API_URL}/tasks/${listId}`, {
      credentials: "include",
      method: "PUT",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        title: text,
      })
    }).then(() => {
      setText("");
      props.onComplete();
    })
  }

  return (
    <Card>
      <CardContent>
        <TextField
          label="Новая задача"
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
        />
        <br/>
        <br/>
        <Button onClick={process} variant="contained">
          Создать
        </Button>
      </CardContent>
    </Card>
  )
}