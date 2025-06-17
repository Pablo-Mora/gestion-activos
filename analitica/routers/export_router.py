# analitica/routers/export_router.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import io
from datetime import datetime # Import datetime

from ..database import get_db
from ..services import analysis_service

router = APIRouter(
    prefix="/export",
    tags=["export"],
)

@router.get("/acta/word/{employee_id}")
async def export_employee_acta_word(employee_id: int, db: Session = Depends(get_db)):
    try:
        file_stream = analysis_service.generate_employee_acta_word(db, employee_id)
        if file_stream is None:
            raise HTTPException(status_code=404, detail=f"Employee with ID {employee_id} not found.")
        filename = f"Acta_Asignacion_Empleado_{employee_id}.docx"
        return StreamingResponse(
            file_stream,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        print(f"Error generating Word acta for employee {employee_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Could not generate Word acta for employee {employee_id}. Error: {str(e)}")

@router.get("/report/excel")
async def export_full_report_excel(db: Session = Depends(get_db)):
    try:
        file_stream = analysis_service.generate_full_excel_report(db)
        filename = f"ActivosTIC_Full_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        return StreamingResponse(
            file_stream,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        print(f"Error generating full Excel report: {e}")
        raise HTTPException(status_code=500, detail=f"Could not generate full Excel report. Error: {str(e)}")
