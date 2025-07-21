from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Comentario

app = FastAPI()

# Configuración CORS para permitir peticiones desde cualquier origen (para pruebas)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

class ComentarioIn(BaseModel):
    nombre: str
    comentario: str

class ComentarioOut(ComentarioIn):
    id: int
    fecha: datetime

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/comments", response_model=List[ComentarioOut])
async def get_comments(db: Session = Depends(get_db)):
    comentarios = db.query(Comentario).order_by(Comentario.fecha.desc()).all()
    return comentarios

@app.get("/comments/random", response_model=List[ComentarioOut])
async def get_random_comments(db: Session = Depends(get_db)):
    from sqlalchemy.sql.expression import func as sql_func
    comentarios = db.query(Comentario).order_by(sql_func.random()).limit(3).all()
    return comentarios

@app.post("/comments", response_model=ComentarioOut)
async def post_comment(comment: ComentarioIn, db: Session = Depends(get_db)):
    try:
        nuevo_comentario = Comentario(
            nombre=comment.nombre,
            comentario=comment.comentario
        )
        db.add(nuevo_comentario)
        db.commit()
        db.refresh(nuevo_comentario)
        return nuevo_comentario
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al guardar comentario: {str(e)}")
