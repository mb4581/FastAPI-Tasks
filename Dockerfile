FROM python:3.11.6-alpine3.18

ARG runtime_deps="curl postgresql-client"
ARG build_deps="postgresql-dev build-base"

RUN apk add --no-cache ${runtime_deps} ${build_deps} \
 && pip install psycopg2==2.9.9 poetry \
 && apk del --no-cache ${build_deps}

ENV POETRY_VIRTUALENVS_CREATE=false

WORKDIR /code
CMD ["sh", "/code/docker-entrypoint.sh"]

COPY pyproject.toml .
COPY poetry.lock .

RUN poetry install --no-dev

COPY . .

RUN adduser -D runner \
 && chown -R runner:root /code \
 && chmod -R g=u /code

USER runner
