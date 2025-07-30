from sqlalchemy import Column, Integer, String, DateTime, func
from database import Base

class Comentario(Base):
    __tablename__ = "comentarios"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    comentario = Column(String(1000), nullable=False)
    fecha = Column(DateTime(timezone=True), server_default=func.now())
    estrellas = Column(Integer, nullable=False)
