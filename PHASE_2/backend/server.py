from datetime import datetime
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from error import HTTPException
import auth
import user
import database
import twitter_feed
from news_api import get_news_articles

app = FastAPI(description="Backend for CDisease website.")

@app.exception_handler(HTTPException)
async def HTTPException_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.code,
        content={"message": f"{exc.description}"}
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RegistrationItem(BaseModel):
    email: str
    password: str
    name_first: str
    name_last: str
    phone: str

class LoginItem(BaseModel):
    email: str
    password: str

class TokenItem(BaseModel):
    token: str

class UserItem(BaseModel):
    token: str
    email: str
    name_first: str
    name_last: str
    phone: str
    country: str
    state: str
    city: str

class ReportItem(BaseModel):
    disease: str
    report_date: str
    report_loc: str

@app.get("/reports")
async def get_reports():
    reports = database.get_reports()
    return JSONResponse(reports)

@app.get("/filtered_reports")
async def get_filtered_reports(start_date: str, end_date: str, key_terms: str, location: str):
    reports = database.get_filtered_reports(start_date, end_date, key_terms, location)
    return JSONResponse(reports)

@app.post("/reports/add")
async def add_report(report_item: ReportItem):
    database.add_report(report_item.disease, report_item.report_date, report_item.report_loc)
    return JSONResponse({})

@app.post("/auth/login")
async def auth_login(login_item: LoginItem):
    user_info = auth.auth_login(login_item.email, login_item.password)
    return JSONResponse(user_info)

@app.post("/auth/register")
async def auth_register(reg_item: RegistrationItem):
    user_info = auth.auth_register(reg_item.email, reg_item.password, reg_item.name_first, reg_item.name_last, reg_item.phone)
    return JSONResponse(user_info)

@app.post("/auth/logout")
async def auth_logout(logout_item: TokenItem):
    is_success = auth.auth_logout(logout_item.token)
    return JSONResponse(is_success)

@app.post("/user")
async def user_details(token_item: TokenItem):
    user_data = user.get_user_details(token_item.token)
    print(user_data, )
    return JSONResponse(user_data)

@app.post("/user/update")
async def update_user_details(user_item: UserItem):
    user.update_user_details(user_item.token, user_item.email, user_item.name_first, user_item.name_last, user_item.country, user_item.state, user_item.phone, user_item.city)
    # new_data = user.get_user_details(user_item.token)
    return JSONResponse({})

@app.get("/feed/sydney")
async def get_twitter_feed():
    response = twitter_feed.get_syd_twitter_feed()
    return JSONResponse(response)

@app.get("/feed/london")
async def get_twitter_feed():
    response = twitter_feed.get_london_twitter_feed()
    return JSONResponse(response)

# endpoint for news API
@app.get("/api/v1/news_articles")
async def news_articles(start_date: str, end_date: str, key_terms: str, location: str):
    res = get_news_articles(start_date, end_date, key_terms, location)
    return res