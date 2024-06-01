import * as React from "react";
import {useEffect} from "react";
import {Backdrop, CircularProgress} from "@mui/material";
import {API_URL} from "../constants.ts";
import {SignInForm} from "./SignInForm.tsx";

export type LoginViewProps = React.PropsWithChildren;

export const UsernameProvider = React.createContext<string>("");

export const useUserName = () => React.useContext(UsernameProvider);

export function LoginView(props: LoginViewProps) {
  // null - unknown
  const [userName, setUserName] = React.useState<string | null>(null);

  useEffect(() => {
    if(userName != null) return;

    fetch(`${API_URL}/user/`, {
      credentials: 'include',
    }).then((r) => {
      if(r.status != 200)
        return {"email": ""};
      return r.json();
    }).then((d) => {
      setUserName(d.email);
    })
  })

  if(userName == null)
    return (
      <Backdrop open>
        <CircularProgress />
      </Backdrop>
    );

  if(userName == "")
    return <SignInForm onReady={() => setUserName(null)} />

  return (
    <UsernameProvider.Provider value={userName}>
      {props.children}
    </UsernameProvider.Provider>
  );
}