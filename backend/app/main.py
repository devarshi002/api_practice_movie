from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client["movie_db"]
collection = db["movies"]



app = FastAPI()


try:
    client = MongoClient("mongodb://localhost:27017/")
    client.server_info()
    print("Mongodb connnected successfully")
except Exception as e:
    print("mongodb failed",e)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all (for now)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class Movie(BaseModel):
    title: str
    rating: int
    image: str | None = None

movies = []

@app.get("/")
def home():
    return {"message": "Movie Api running"}

@app.post("/movies")
def add_movies(movie: Movie):
    movie_dict = movie.dict()
    result = collection.insert_one(movie_dict)
    movie_dict["_id"]= str(result.inserted_id)
    return movie_dict

@app.get("/movies")
def get_movies():
    movies= []

    for m in collection.find():
        m["_id"] = str(m["_id"])
        movies.append(m)
    return movies

@app.delete("/movies/{id}")
def delete_movie(id:str):
    collection.delete_one({"_id":ObjectId(id)})
    return {"message": "Deleted"}

@app.put("/movies/{id}")
def update_movie(id:str, movie: Movie):
    updated_data = movie.dict()

    collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": updated_data}
        
    )
    return {"message": "Movie updated"}