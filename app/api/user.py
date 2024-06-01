import typing

import fastapi
import sqlalchemy as sa
from fastapi import HTTPException
from sqlalchemy.exc import NoResultFound

from app import models, schemas
from app.ioc import IOCContainer

router: typing.Final = fastapi.APIRouter()


@router.get("/", description="Get account status", tags=["user"])
async def get_current_account_info(request: fastapi.Request):
    # Б - Безопасность. Не делайте так.
    email = request.cookies.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Not authorized")
    return typing.cast(schemas.UserInfo, {"email": email})


@router.put("/", status_code=201, description="Register", tags=["user"])
async def register(response: fastapi.Response, data: schemas.UserLoginBody):
    session = await IOCContainer.session()

    # Занят ли юзернейм?
    query = sa.select(
        sa.func.count()
    ).select_from(
        sa.select(models.UserModel).filter_by(email=data.email).subquery()
    )

    result = await session.execute(query)
    if result.scalar_one() > 0:
        raise HTTPException(status_code=400, detail="EMail already used")

    # Создаём пользователя
    entry = models.UserModel(email=data.email, password=data.password)
    session.add(entry)
    await session.commit()

    # Ставим куку чтоб пользователь стал авторизован
    response.set_cookie("email", data.email, samesite="none")

    return True


@router.post("/", status_code=201, description="Log in", tags=["user"])
async def log_in(response: fastapi.Response, data: schemas.UserLoginBody):
    session = await IOCContainer.session()

    # Ищем аккаунт
    query = sa.select(models.UserModel).filter_by(email=data.email, password=data.password)
    try:
        result = await session.execute(query)
        entry = result.scalar_one()
    except NoResultFound:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Ставим куку чтоб пользователь стал авторизован
    response.set_cookie("email", data.email, samesite="none")

    return True
