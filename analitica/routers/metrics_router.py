# analitica/routers/metrics_router.py
from fastapi import APIRouter, HTTPException # Removed Depends
from fastapi.responses import StreamingResponse
# Removed: from sqlalchemy.orm import Session
# Removed: from sqlalchemy import func
# Removed: from ..database import get_db
# Removed: from ..db_models import Employee, License

from ..schemas import MetricResponse # CountByItem is used by services
from ..services import analysis_service

router = APIRouter(
    prefix="/metrics",
    tags=["metrics"],
)

@router.get("/assets/count-by-type", response_model=MetricResponse)
def get_hardware_count_by_type(): # Removed db: Session
    data_list = analysis_service.get_hardware_counts_by_type_pandas() # Removed db
    return MetricResponse(metric_name="Hardware Count by Type", data=data_list) # Updated metric_name for clarity

@router.get("/assets/type-distribution-chart")
async def get_hardware_type_distribution_chart_endpoint(): # Removed db: Session
    try:
        hardware_counts_data = analysis_service.get_hardware_counts_by_type_pandas() # Removed db

        image_buffer = analysis_service.generate_hardware_type_distribution_chart(hardware_counts_data)
        return StreamingResponse(image_buffer, media_type="image/png")
    except Exception as e:
        print(f"Error generating chart: {e}")
        # Consider more specific error logging or handling if possible
        raise HTTPException(status_code=500, detail="Could not generate hardware type distribution chart.")

@router.get("/employees/count-by-department", response_model=MetricResponse)
def get_employee_count_by_department(): # Removed db: Session
    # This logic is now in analysis_service
    data_list = analysis_service.get_employee_counts_by_department()
    return MetricResponse(metric_name="Employee Count by Department", data=data_list)

@router.get("/licenses/count-by-software", response_model=MetricResponse)
def get_license_count_by_software(): # Removed db: Session
    # This logic is now in analysis_service
    data_list = analysis_service.get_license_counts_by_software()
    return MetricResponse(metric_name="License Count by Software Name", data=data_list)
