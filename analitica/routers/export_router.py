# analitica/routers/export_router.py
from fastapi import APIRouter, HTTPException # Removed Depends
from fastapi.responses import StreamingResponse
# Removed: from sqlalchemy.orm import Session
# Removed: import io (already imported in service)
from datetime import datetime

# Removed: from ..database import get_db
from ..services import analysis_service

router = APIRouter(
    prefix="/export",
    tags=["export"],
)

@router.get("/acta/word/{employee_id}")
async def export_employee_acta_word(employee_id: int): # Removed db: Session
    try:
        # Call the refactored service function (which no longer needs db)
        file_stream = analysis_service.generate_employee_acta_word(employee_id) # Removed db
        if file_stream is None:
            raise HTTPException(status_code=404, detail=f"Employee with ID {employee_id} not found or data incomplete.")

        filename = f"Acta_Asignacion_Empleado_{employee_id}.docx"
        return StreamingResponse(
            file_stream,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        # Log the exception for server-side review
        print(f"Error generating Word acta for employee {employee_id}: {type(e).__name__} - {e}")
        raise HTTPException(status_code=500, detail=f"Could not generate Word acta for employee {employee_id}.")

@router.get("/report/excel")
async def export_full_report_excel(): # Removed db: Session
    try:
        # Call the refactored service function (which no longer needs db)
        file_stream = analysis_service.generate_full_excel_report() # Removed db
        if file_stream is None: # Should not happen if service returns empty Excel for no data
             raise HTTPException(status_code=500, detail="Failed to generate Excel report (empty stream).")

        filename = f"ActivosTIC_Full_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        return StreamingResponse(
            file_stream,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        # Log the exception for server-side review
        print(f"Error generating full Excel report: {type(e).__name__} - {e}")
        raise HTTPException(status_code=500, detail="Could not generate full Excel report.")
