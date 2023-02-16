from typing import List, Optional
from pydantic import BaseModel

class Log(BaseModel):
    team_name: str
    access_time: str
    data_source: str

class Location(BaseModel):
    country: str
    location: str

class Report(BaseModel):
    diseases: List[str]
    syndromes: List[str]
    event_date: str
    locations: List[Location]

class Article(BaseModel):
    url: str
    date_of_publication: str = None
    headline: str
    main_text: str
    reports: List[Report]

class Item(BaseModel):
    articles: List[Article]
    log: Log

class Error(BaseModel):
    loc: Optional[List[str]] = None
    msg: str
    type: str

class ErrorResponse(BaseModel):
    detail: List[Error]

class BasicErrorResponse(BaseModel):
    detail: str