#!/bin/bash
cd PB
python3 -m venv .venv
source ./.venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

cd ..
cd final_proj
npm install