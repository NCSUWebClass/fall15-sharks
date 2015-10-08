#!/usr/bin/env bash

source .env/bin/activate
cd project
gunicorn --bind 0.0.0.0:8000 --workers 1 project.wsgi:app

