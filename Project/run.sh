#!/bin/bash
cd PB
python3 ./TFC/manage.py makemigrations
python3 ./TFC/manage.py migrate
python3 ./TFC/manage.py runserver &

cd ..
cd final_proj
npm start