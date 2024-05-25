import fastapi
import sqlalchemy as sa
from fastapi import HTTPException
from sqlalchemy.exc import NoResultFound

from app import models


async def validate_user(request: fastapi.Request, session, valid_user: str):
    if await get_user_id(request, session) != valid_user:
        raise HTTPException(status_code=400, detail="Access denied")


async def get_user_id(request: fastapi.Request, session):
    try:
        query = sa.select(models.UserModel).filter_by(email=request.cookies.get("email"))
        result = await session.execute(query)
        return result.scalar_one().id
    except NoResultFound:
        raise HTTPException(status_code=400, detail="Access denied")
