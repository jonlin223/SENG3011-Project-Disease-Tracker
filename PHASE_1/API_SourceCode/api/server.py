from fastapi import FastAPI, HTTPException, status, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from .backend import get_articles
from .data_types import BasicErrorResponse, Item, ErrorResponse
from .errors import DateError

tags_metadata = [
    {
        "name": "Articles",
        "description": "Endpoints to query for articles"
    }
]

app = FastAPI(description="API endpoint documentation for SENG3011-The_Implementers. API Available at http://implementerscdcapi-env.eba-h2hzu5xc.ap-southeast-2.elasticbeanstalk.com", openapi_tags=tags_metadata)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content=jsonable_encoder({'detail': exc.errors()}))

@app.get("/api/v1/articles", response_model=Item, responses={400: {"model": ErrorResponse}, 204: {}, 405: {"model": BasicErrorResponse}}, tags=['Articles'])
async def articles(start_date: str, end_date: str, key_terms: str, location: str):
    """
    Returns list of articles matching given search terms. Click *Try it out* to test endpoint.

    # Query URL
    * http://implementerscdcapi-env.eba-h2hzu5xc.ap-southeast-2.elasticbeanstalk.com/api/v1/articles?start_date=yyyy-MM-ddTHH:mm:ss&end_date=yyyy-MM-ddTHH:mm:ss&key_terms=str&location=str

    # Inputs
    - **start_date**: String in format yyyy-MM-ddTHH:mm:ss
    - **end_date**: String in format yyyy-MM-ddTHH:mm:ss
    - **key_terms**: String of terms seperated by commas
    - **location**: String describing location of outbreak

    # Outputs
    - **articles**: A list of articles containing reports that match the search query
        - *url*: String describing url where article is located
        - *date_of_publication*: String describing date of publication. Can be described as an exact date or a range of dates
            - exact: yyyy-mm-dd hh:mm:ss format, only year is mandatory, empty characters filled by 'x'
            - range: dates *d1* and *d2* in exact format, listed *d1* to *d2* where *d1* must be earlier than *d2*
        - *headline*: String representing article's headline
        - *main_text*: String representing body of article
        - *reports*: List of reports describing specific outbreaks discussed in the article
            - *diseases*: List of strings representing outbreak disease
            - *syndromes*: List of strings representing outbreak symptoms
            - *event_date*: String describing date of outbreak, for format see *date_of_publication*
            - *locations*: List of locations where outbreak has occurred
                - *country*: String representing name of country where outbreak occurred
                - *location*: String representing specific location within country
    - **log**: Log describing data origin and access time

    # Example Call
    
    For visual indication of schema strcuture, see *Successful Response* schema.

    - **Input**:
        - http://implementerscdcapi-env.eba-h2hzu5xc.ap-southeast-2.elasticbeanstalk.com/api/v1/articles?start_date=2021-01-01T00%3A00%3A00&end_date=2022-03-15T00%3A00%3A00&key_terms=ebola%2Clisteria&location=Florida
    - **Output**
        - **articles**: 
            - *url*: "https://www.cdc.gov/listeria/outbreaks/delimeat-10-20/index.html"
            - *date_of_publication*: "2021-01-28 17:00:00"
            - *headline*:  "Outbreak of Listeria Infections Linked to Deli Meats"
            - *main_text*: "CDC, public health and regulatory officials in several states, and the U.S. Department of Agriculture’s Food Safety and Inspection Service (USDA-FSIS) investigated a multistate outbreak of Listeria monocytogenes infections linked to deli meats."
            - *reports*:
                - *diseases*: ['Listeria']
                - *syndromes*: []
                - *event_date*: "2021-01-28 00:00:00"
                - *locations*:
                    - *country*: "US"
                    - *location*: "Florida"
        - **log**: Log describing data origin and access time
            - *team_name*: "The Implementers"
            - *access_time*: "2022-03-17 23:13:51"
            - *data_source*: "https://www.cdc.gov/outbreaks/index.html"

    # Status Codes:
    - **200**: *Successful Response*, articles returned
    - **204**: *No Content*, request returned to matches
    - **400**: *Bad Request*, something wrong with request, response will detail location and type of error. Reasons for this include:
        - Incorrect date syntax
        - End date before start date
        - Missing parameters
    - **404**: *Not Found*, endpoint does not exist
    - **405**: *Method Not Allowed*, wrong REST method provided

    # Issues:
    - Some fields may be empty due to insufficient detail within articles. These include location and syndromes
        - If specific location not specified, country may be located within locations.location
    
    """
    try:
        response = get_articles(start_date, end_date, key_terms, location)
        if len(response['articles']) == 0:
            #return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content = {"detail": "No articles matching query"})
            raise HTTPException(status_code=status.HTTP_204_NO_CONTENT)
        return response
    except DateError:
        error_details = {"detail": [{"loc": ["query", "start_date", "end_date"], "msg": "Invalid Date Range:End date before start date", "type": ""}]}
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content=error_details)
    except ValueError:
        #raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect Date Syntax")
        error_details = {"detail": [{"loc": ["query", "date"], "msg": "Incorrect date format. Should be yyyy-MM-ddTHH:mm:ss", "type": ""}]}
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content=error_details)
