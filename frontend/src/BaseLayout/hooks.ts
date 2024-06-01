import React from "react";

export const TaskListIdProvider = React.createContext<number>(null);

export const useTaskListId = () => React.useContext(TaskListIdProvider);
