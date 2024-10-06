.PHONY: test init_db migrate generate_migration default
.DEFAULT_GOAL := default
export PYTHONPATH=.

# This is for running inside PyCharm
export PATH:=${PWD}/venv/bin:${PATH}


default: migrate init_db

generate_migration:
@ alembic revision --autogenerate

migrate:
@ alembic upgrade head

test:
@ pytest -v tests

init_db:
@ python fastapp/scripts/initialise.py ## src/database.py??


vim:ft=make