#!/usr/bin/env bash

source .env/bin/activate
gunicorn --bind 0.0.0.0:8000 --workers 3 project.wsgi:app
deactivate
