# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import pickle
# import random

# # ---------------------------
# # Load model and data
# # ---------------------------
# MODEL_PATH = "coffee_recommender.pkl"

# with open(MODEL_PATH, "rb") as f:
#     data = pickle.load(f)

# temp_model = data["model"]
# BEVERAGE_MENU = data["beverage_menu"]
# FOOD_MENU = data["food_menu"]
# TIME_MAP = data["time_map"]
# MOOD_MAP = data["mood_map"]
# TASTE_MAP = data["taste_map"]

# # ---------------------------
# # FastAPI app
# # ---------------------------
# app = FastAPI(title="Coffee + Snack Recommender API")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # Next.js frontend
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ---------------------------
# # Input schema
# # ---------------------------
# class UserInput(BaseModel):
#     text: str

# # ---------------------------
# # Parse user text (same as training)
# # ---------------------------
# def parse_user_input(text: str):
#     text = text.lower()

#     time = next((TIME_MAP[k] for k in TIME_MAP if k in text), 1)
#     mood = next((MOOD_MAP[k] for k in MOOD_MAP if k in text), 3)
#     taste = next((TASTE_MAP[k] for k in TASTE_MAP if k in text), 3)

#     return [time, mood, taste]

# # ---------------------------
# # Recommendation endpoint
# # ---------------------------
# @app.post("/recommend")
# def recommend(input: UserInput):
#     features = parse_user_input(input.text)
#     temperature = temp_model.predict([features])[0]

#     # Select beverages exactly like your model
#     if temperature == "hot":
#         beverage_choices = [
#             b for b in BEVERAGE_MENU
#             if "HOT" in b
#         ]
#     else:
#         beverage_choices = [
#             b for b in BEVERAGE_MENU
#             if (
#                 "ICED" in b
#                 or "COLD" in b
#                 or "SHAKE" in b
#                 or "TEA" in b
#             )
#         ]

#     beverage = random.choice(beverage_choices)
#     food = random.choice(list(FOOD_MENU.keys()))

#     return {
#         "input_text": input.text,
#         "predicted_temperature": temperature,
#         "beverage": beverage,
#         "beverage_price": BEVERAGE_MENU[beverage],
#         "food": food,
#         "food_price": FOOD_MENU[food],
#         "total_amount": BEVERAGE_MENU[beverage] + FOOD_MENU[food]
#     }

# # ---------------------------
# # Health check
# # ---------------------------
# @app.get("/")
# def root():
#     return {"status": "Coffee recommender is running ☕"}


import os
import pickle
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ---------------------------
# Download model from Google Drive
# ---------------------------
MODEL_FILE = "coffee_recommender.pkl"
MODEL_ID = os.getenv("GOOGLE_DRIVE_MODEL_ID")
MODEL_URL = f"https://drive.google.com/uc?export=download&id={MODEL_ID}"

if not os.path.exists(MODEL_FILE):
    print("Downloading model from Google Drive...")
    r = requests.get(MODEL_URL)
    r.raise_for_status()
    with open(MODEL_FILE, "wb") as f:
        f.write(r.content)
    print("Model downloaded successfully!")

# ---------------------------
# Load model
# ---------------------------
with open(MODEL_FILE, "rb") as f:
    data = pickle.load(f)

temp_model = data["model"]
BEVERAGE_MENU = data["beverage_menu"]
FOOD_MENU = data["food_menu"]
TIME_MAP = data["time_map"]
MOOD_MAP = data["mood_map"]
TASTE_MAP = data["taste_map"]

# ---------------------------
# FastAPI app
# ---------------------------
app = FastAPI(title="Coffee + Snack Recommender API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change this to your frontend URL on deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Input schema
# ---------------------------
class UserInput(BaseModel):
    text: str

# ---------------------------
# Parse user text
# ---------------------------
def parse_user_input(text: str):
    text = text.lower()
    time = next((TIME_MAP[k] for k in TIME_MAP if k in text), 1)
    mood = next((MOOD_MAP[k] for k in MOOD_MAP if k in text), 3)
    taste = next((TASTE_MAP[k] for k in TASTE_MAP if k in text), 3)
    return [time, mood, taste]

# ---------------------------
# Recommendation endpoint
# ---------------------------
@app.post("/recommend")
def recommend(input: UserInput):
    features = parse_user_input(input.text)
    temperature = temp_model.predict([features])[0]

    if temperature == "hot":
        beverage_choices = [b for b in BEVERAGE_MENU if "HOT" in b]
    else:
        beverage_choices = [b for b in BEVERAGE_MENU if "ICED" in b or "COLD" in b or "SHAKE" in b or "TEA" in b]

    beverage = random.choice(beverage_choices)
    food = random.choice(list(FOOD_MENU.keys()))

    return {
        "input_text": input.text,
        "predicted_temperature": temperature,
        "beverage": beverage,
        "beverage_price": BEVERAGE_MENU[beverage],
        "food": food,
        "food_price": FOOD_MENU[food],
        "total_amount": BEVERAGE_MENU[beverage] + FOOD_MENU[food]
    }

# ---------------------------
# Health check
# ---------------------------
@app.get("/")
def root():
    return {"status": "Coffee recommender is running ☕"}
