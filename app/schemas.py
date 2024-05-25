import datetime

import pydantic
from pydantic import BaseModel, PositiveInt


class Base(BaseModel):
    model_config = pydantic.ConfigDict(from_attributes=True)


class UserInfo(Base):
    email: str


class UserLoginBody(Base):
    email: str
    password: str


class ListCreateModel(Base):
    name: str


class TaskItem(Base):
    id: int
    title: str
    completed: bool


class TaskList(Base):
    id: int
    name: str


class TaskListBody(TaskList):
    items: list[TaskItem]


class NewTask(Base):
    title: str
