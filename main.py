from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

app = FastAPI()

# 用于存储番茄钟的数据
tomato_timers = {}

app.mount("/frontend", StaticFiles(directory="frontend", html=True), name="frontend")


class TomatoTimer(BaseModel):
    group: str
    end_time: datetime
    is_running: bool


@app.get("/")
async def redirect_to_frontend():
    return RedirectResponse(url="/frontend")


@app.post("/start_timer")
async def start_timer(timer: TomatoTimer):
    tomato_timers[timer.group] = timer
    return {"message": "Timer started successfully"}


@app.get("/get_timer/{group}")
async def get_timer(group: str):
    if group in tomato_timers:
        return tomato_timers[group]
    else:
        return {"message": "Timer not found"}


@app.post("/stop_timer/{group}")
async def stop_timer(group: str):
    if group in tomato_timers:
        del tomato_timers[group]
        return {"message": "Timer stopped successfully"}
    else:
        return {"message": "Timer not found"}
