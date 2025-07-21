@echo off
REM Crear entorno virtual
python -m venv env

REM Activar entorno virtual
call env\Scripts\activate.bat

REM Instalar dependencias
pip install -r requirements.txt

REM Ejecutar servidor uvicorn
call env\Scripts\activate.bat
uvicorn main:app --reload
