import logging
import typing

import sqlalchemy as sa
from sqlalchemy import orm

logger = logging.getLogger(__name__)


METADATA: typing.Final = sa.MetaData()


class Base(orm.DeclarativeBase):
    metadata = METADATA


class BaseModel(Base):
    __abstract__ = True

    id: orm.Mapped[typing.Annotated[int, orm.mapped_column(primary_key=True)]]


class UserModel(BaseModel):
    __tablename__ = "user"

    email: orm.Mapped[str] = orm.mapped_column(sa.String, nullable=False)
    password: orm.Mapped[str] = orm.mapped_column(sa.String, nullable=False)


class TaskList(BaseModel):
    __tablename__ = "task_list"

    name: orm.Mapped[str] = orm.mapped_column(sa.String, nullable=False)
    owner: orm.Mapped[int] = orm.mapped_column(sa.Integer, sa.ForeignKey("user.id"))
    items: orm.Mapped[list["Task"]] = orm.relationship("Task", lazy="noload", uselist=True)


class Task(BaseModel):
    __tablename__ = "task"

    title: orm.Mapped[str] = orm.mapped_column(sa.String, nullable=False)
    completed: orm.Mapped[bool] = orm.mapped_column(sa.Boolean, nullable=False)
