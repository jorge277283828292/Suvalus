from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import databases
import sqlalchemy
from datetime import datetime

DATABASE_URL = "mysql+mysqlconnector://root:Root1234@127.0.0.1:3306/kyra"

database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

comentarios = sqlalchemy.Table(
    "comentarios",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("nombre", sqlalchemy.String(length=100)),
    sqlalchemy.Column("comentario", sqlalchemy.Text),
    sqlalchemy.Column("fecha", sqlalchemy.DateTime),
)

engine = sqlalchemy.create_engine(DATABASE_URL)
metadata.create_all(engine)

app = FastAPI()

class ComentarioIn(BaseModel):
    nombre: str
    comentario: str

class ComentarioOut(ComentarioIn):
    id: int
    fecha: datetime

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/comments", response_model=List[ComentarioOut])
async def get_comments():
    query = comentarios.select().order_by(comentarios.c.fecha.desc())
    return await database.fetch_all(query)

@app.post("/comments", response_model=ComentarioOut)
async def post_comment(comment: ComentarioIn):
    query = comentarios.insert().values(
        nombre=comment.nombre,
        comentario=comment.comentario,
        fecha=datetime.utcnow()
    )
    last_record_id = await database.execute(query)
    return {**comment.dict(), "id": last_record_id, "fecha": datetime.utcnow()}
