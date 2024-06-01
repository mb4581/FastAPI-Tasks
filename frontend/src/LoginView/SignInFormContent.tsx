import {SignInFormProps} from "./SignInForm.tsx";
import React from "react";
import {Box, Button, TextField} from "@mui/material";
import {API_URL} from "../constants.ts";

export function SignInFormContent(props: SignInFormProps) {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  async function process(method: "POST" | "PUT") {
    const r = await fetch(`${API_URL}/user`, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const d = await r.json();
    console.log(r.status, d);

    if(r.status >= 300)
      alert(d.detail);
    else
      props.onReady();
  }

  return (
    <div>
      <Box m={2}>
        <TextField
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="EMail"
        />
      </Box>
      <Box m={2}>
        <TextField
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Пароль"
          type="password"
        />
      </Box>
      <Box mx={2}>
        <Button onClick={() => process("POST")} variant="contained" sx={{marginRight: 2}}>
          Войти
        </Button>
        <Button onClick={() => process("PUT")} variant="outlined">
          Регистрация
        </Button>
      </Box>
    </div>
  );
}