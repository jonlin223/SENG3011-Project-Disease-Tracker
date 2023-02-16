# SENG3011_The-Implementers

## Introduction

This project was completed for UNSW SENG3011. The team created a web application interfacing with API and scraping tools.
The project members are:
- Jonathan Lin
- Callum Jones
- Abdullar Alghrer
- Negin Ghanavi
- Tung Hoang

This project is originally hosted [here](https://github.com/callum-jones19/SENG3011_The-Implementers)

## Note

Our CDC API currently supports queries on breakouts for the followning diseases:
- Listeriosis
- Measles
- Hepatitis
- Ebola

Additional diseases, syndromes and reports will be added in future releases.

## Local Setup
### API
1. Clone the repository
2. Navigate to the source code folder
```
cd PHASE_1/API_SourceCode/
```
3. Create a virtual environment
```
python3 -m venv venv
```
4. Activate environment
```
source venv/bin/activate
```
5. Install dependencies
```
python3 -m pip install -r requirements.txt 
```
- To start server:
```
uvicorn api.server:app --reload
```
- To run tests:
```
python3 -m pytest ../TestScripts
```
- To run scrapers:
```
cd scraper
scrapy crawl <scraper_name>
```
where ```scraper_name``` is one of ```[ebola, listeria, measles, hepatitis]```
### Web Application
1. Clone the repository
#### Backend
2. Navigate to the backend folder
```
cd PHASE_2/backend/
```
3. Create a virtual environment
```
python3 -m venv venv
```
4. Create a Python requirements file
```
pip freeze > requirements.txt
```
5. Install dependencies
```
python3 -m pip install -r requirements.txt 
```
6. Start backend server
```
uvicorn server:app --reload
```
#### Frontend
1. Navigate to the frontend folder
```
cd PHASE_2/frontend/
```
2. Install dependencies
```
npm install
```
3. Run frontend server
```
npm start
```
