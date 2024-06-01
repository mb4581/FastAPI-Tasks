import {LoginView} from "./LoginView";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {BaseLayout} from "./BaseLayout";
import {TasksView} from "./TasksView/TasksView.tsx";

export default function App() {
  return (
    <LoginView>
      <BaseLayout>
        <TasksView />
      </BaseLayout>
    </LoginView>
  )
}