# analitica/main.py
from fastapi import FastAPI
from .routers import metrics_router, export_router # Add export_router

app = FastAPI(
    title="ActivosTIC Analítica API",
    description="API para análisis de datos y generación de reportes del sistema ActivosTIC.",
    version="0.1.0"
)

@app.get("/")
async def root():
    return {"message": "Bienvenido al API de Analítica de ActivosTIC"}

app.include_router(metrics_router.router)
app.include_router(export_router.router) # Include the new export router
