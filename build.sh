#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing dependencies..."
pip install -r MLBackend/requirements.txt

echo "Collecting static files..."
python MLBackend/manage.py collectstatic --no-input

echo "Running migrations..."
python MLBackend/manage.py migrate
