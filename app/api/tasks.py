import typing

import fastapi
import sqlalchemy as sa
from fastapi import HTTPException
from sqlalchemy.exc import NoResultFound

from app import models, schemas
from app.helpers.user import validate_user, get_user_id
from app.ioc import IOCContainer

router: typing.Final = fastapi.APIRouter()


async def find_list(request, session, list_id: int):
    try:
        result = await session.execute(sa.select(models.TaskList).filter_by(id=list_id))
        list_entry = result.scalar_one()
        await validate_user(request, session, list_entry.owner)
        return list_entry
    except ModuleNotFoundError:
        raise HTTPException(status_code=404, detail="Not found")


@router.get("/", description="Find user's lists", tags=["task_list"])
async def get_lists(request: fastapi.Request):
    session = await IOCContainer.session()
    owner_id = await get_user_id(request, session)

    # Ищем
    query = sa.select(models.TaskList).filter_by(owner=owner_id)
    result = await session.execute(query)
    out = []
    for (t_list, ) in result.all():
        out.append({"name": t_list.name, "id": t_list.id})

    return typing.cast(list[schemas.TaskList], out)


@router.put("/", description="Create task list", tags=["task_list"])
async def create_list(request: fastapi.Request, data: schemas.ListCreateModel):
    session = await IOCContainer.session()
    owner_id = await get_user_id(request, session)

    # Создаём
    list_entry = models.TaskList(owner=owner_id, name=data.name)
    session.add(list_entry)
    await session.commit()

    return typing.cast(schemas.TaskListBody, list_entry)


@router.get("/{list_id}", description="Read task list", tags=["task_list"])
async def get_list_items(request: fastapi.Request, list_id: int) -> schemas.TaskListBody:
    session = await IOCContainer.session()
    t_list = await find_list(request, session, list_id)
    t_items = await session.execute(sa.select(models.Task).filter_by(list_id=list_id))
    return typing.cast(schemas.TaskListBody, {
        "id": t_list.id,
        "name": t_list.name,
        "items": [{
            "title": i.title,
            "id": i.id,
            "completed": i.completed,
        } for (i, ) in list(t_items.all())]
    })


@router.put("/{list_id}", description="Put new task to list", tags=["task"])
async def add_task(request: fastapi.Request, data: schemas.NewTask, list_id: int):
    session = await IOCContainer.session()

    # Чисто проверить что он есть
    await find_list(request, session, list_id)

    # Создаём
    entry = models.Task(title=data.title, list_id=list_id, completed=False)
    session.add(entry)
    await session.commit()

    return entry


@router.delete("/{list_id}", status_code=201, tags=["task_list"])
async def delete_list(request: fastapi.Request, list_id: int, task_id: int):
    session = await IOCContainer.session()

    # Чисто проверить что он есть
    entry = await find_list(request, session, list_id)
    await session.delete(entry)
    await session.commit()

    return True


@router.post("/{list_id}/{task_id}", description="Mark task as completed", status_code=201, tags=["task"])
async def complete_task(request: fastapi.Request, list_id: int, task_id: int):
    session = await IOCContainer.session()

    # Чисто проверить что он есть
    await find_list(request, session, list_id)

    # Ищем
    try:
        entry = (await session.execute(sa.select(models.Task).filter_by(id=task_id))).scalar_one()
        entry.completed = True
        await session.commit()
        return True
    except NoResultFound:
        raise HTTPException(status_code=404, detail="Task not found")


@router.delete("/{list_id}/{task_id}", status_code=201, tags=["task"])
async def delete_task(request: fastapi.Request, list_id: int, task_id: int):
    session = await IOCContainer.session()

    # Чисто проверить что он есть
    await find_list(request, session, list_id)

    # Ищем
    try:
        entry = (await session.execute(sa.select(models.Task).filter_by(id=task_id))).scalar_one()
        await session.delete(entry)
        await session.commit()
        return True
    except NoResultFound:
        raise HTTPException(status_code=404, detail="Task not found")






