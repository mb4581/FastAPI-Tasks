import contextlib
import typing

import fastapi
from fastapi.middleware.cors import CORSMiddleware
from that_depends.providers import DIContextMiddleware

from app import exceptions, ioc
from app.exceptions import DatabaseValidationError
from app.api.user import router as user_router
from app.api.tasks import router as tasks_router


def include_routers(app: fastapi.FastAPI) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(user_router, prefix="/user")
    app.include_router(tasks_router, prefix="/tasks")


class AppBuilder:
    def __init__(self) -> None:
        self.settings = ioc.IOCContainer.settings.sync_resolve()
        self.app: fastapi.FastAPI = fastapi.FastAPI(
            title=self.settings.service_name,
            debug=self.settings.debug,
            lifespan=self.lifespan_manager,
        )
        include_routers(self.app)
        self.app.add_middleware(DIContextMiddleware)
        self.app.add_exception_handler(
            DatabaseValidationError,
            exceptions.database_validation_exception_handler,  # type: ignore[arg-type]
        )

    @contextlib.asynccontextmanager
    async def lifespan_manager(self, _: fastapi.FastAPI) -> typing.AsyncIterator[dict[str, typing.Any]]:
        try:
            yield {}
        finally:
            await ioc.IOCContainer.tear_down()


application = AppBuilder().app
