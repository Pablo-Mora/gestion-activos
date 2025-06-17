# Complete content for analitica/routers/metrics_router.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import get_db
from ..db_models import Employee, License # Hardware model not directly used here now
from ..schemas import MetricResponse, CountByItem
from ..services import analysis_service

router = APIRouter(
    prefix="/metrics",
    tags=["metrics"],
)

@router.get("/assets/count-by-type", response_model=MetricResponse)
def get_hardware_count_by_type(db: Session = Depends(get_db)):
    data_list = analysis_service.get_hardware_counts_by_type_pandas(db)
    return MetricResponse(metric_name="Hardware Count by Type (via Pandas Service)", data=data_list)

@router.get("/assets/type-distribution-chart")
async def get_hardware_type_distribution_chart_endpoint(db: Session = Depends(get_db)): # Renamed function
    try:
        hardware_counts_data = analysis_service.get_hardware_counts_by_type_pandas(db)
        if not hardware_counts_data: # Handle case where data itself is empty for chart
            # Optionally return a specific image indicating no data, or 204 No Content, or 404
            # For now, the chart function itself handles creating a "no data" image
            pass # Let the chart function handle empty data plotting

        image_buffer = analysis_service.generate_hardware_type_distribution_chart(hardware_counts_data)
        return StreamingResponse(image_buffer, media_type="image/png")
    except Exception as e:
        print(f"Error generating chart: {e}")
        raise HTTPException(status_code=500, detail="Could not generate hardware type distribution chart.")

@router.get("/employees/count-by-department", response_model=MetricResponse)
def get_employee_count_by_department(db: Session = Depends(get_db)):
    query_result = db.query(Employee.department, func.count(Employee.id).label("count")).group_by(Employee.department).all()
    data_list = [CountByItem(item=row.department if row.department else "N/A", count=row.count) for row in query_result]
    return MetricResponse(metric_name="Employee Count by Department", data=data_list)

@router.get("/licenses/count-by-software", response_model=MetricResponse)
def get_license_count_by_software(db: Session = Depends(get_db)):
    query_result = db.query(License.software_name, func.count(License.id).label("count")).group_by(License.software_name).all()
    data_list = [CountByItem(item=row.software_name if row.software_name else "N/A", count=row.count) for row in query_result]
    return MetricResponse(metric_name="License Count by Software Name", data=data_list)
