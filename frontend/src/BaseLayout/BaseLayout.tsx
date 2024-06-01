import React from "react";
import {AppHeader} from "./AppHeader.tsx";
import {WithTaskListChooser} from "./WithTaskListChooser.tsx";

export function BaseLayout(props: React.PropsWithChildren) {
  return (
    <>
      <AppHeader />
      <WithTaskListChooser>
        {props.children}
      </WithTaskListChooser>
    </>
  )
}
