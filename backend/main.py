from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime
import json
import os

app = FastAPI()

COMMENTS_FILE = "backend/comments.json"

class ComentarioIn(BaseModel):
    nombre: str
    comentario: str

class ComentarioOut(ComentarioIn):
    id: int
    fecha: datetime

def read_comments() -> List[ComentarioOut]:
    if not os.path.exists(COMMENTS_FILE):
        return []
    with open(COMMENTS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
        # Convertir fecha de string a datetime
        for item in data:
            item["fecha"] = datetime.fromisoformat(item["fecha"])
        return data

def write_comments(comments: List[ComentarioOut]):
    # Convertir fecha a string ISO para guardar en JSON
    data = []
    for c in comments:
        data.append({
            "id": c["id"],
            "nombre": c["nombre"],
            "comentario": c["comentario"],
            "fecha": c["fecha"].isoformat() if isinstance(c["fecha"], datetime) else c["fecha"]
        })
    with open(COMMENTS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

@app.get("/comments", response_model=List[ComentarioOut])
async def get_comments():
    comments = read_comments()
    # Ordenar por fecha descendente
    comments.sort(key=lambda x: x["fecha"], reverse=True)
    return comments

@app.post("/comments", response_model=ComentarioOut)
async def post_comment(comment: ComentarioIn):
    comments = read_comments()
    new_id = max([c["id"] for c in comments], default=0) + 1
    new_comment = {
        "id": new_id,
        "nombre": comment.nombre,
        "comentario": comment.comentario,
        "fecha": datetime.utcnow()
    }
    comments.append(new_comment)
    write_comments(comments)
    return new_comment
