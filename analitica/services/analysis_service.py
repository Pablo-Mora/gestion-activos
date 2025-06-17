# analitica/services/analysis_service.py
import pandas as pd
from sqlalchemy.orm import Session
from typing import List
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import io
from docx import Document
from docx.shared import Inches, Pt # Inches, Pt might not be used in current Word gen, but good to keep if formatting expands
from docx.enum.text import WD_ALIGN_PARAGRAPH
from datetime import datetime

from ..db_models import Employee, Hardware, License, WebAccess
from ..schemas import CountByItem # Used by get_hardware_counts_by_type_pandas

def get_hardware_counts_by_type_pandas(db: Session) -> List[CountByItem]:
    query = db.query(Hardware.id, Hardware.type).all()
    if not query:
        return []
    df = pd.DataFrame(query, columns=['id', 'type'])
    df['type'] = df['type'].fillna('N/A')
    counts_df = df.groupby('type')['id'].count().reset_index(name='count')
    result_list = [CountByItem(item=row['type'], count=row['count']) for index, row in counts_df.iterrows()]
    return result_list

def generate_hardware_type_distribution_chart(data: List[CountByItem]) -> io.BytesIO:
    if not data:
        fig, ax = plt.subplots()
        ax.text(0.5, 0.5, "No data available for chart", ha='center', va='center', fontsize=12)
        ax.set_xticks([]); ax.set_yticks([])
        buf = io.BytesIO(); fig.savefig(buf, format='png'); plt.close(fig); buf.seek(0)
        return buf
    items = [d.item for d in data]; counts = [d.count for d in data]
    fig, ax = plt.subplots(figsize=(10, max(6, len(items) * 0.5))) # Dynamic height
    sns.barplot(x=counts, y=items, ax=ax, palette="viridis", orient='h')
    ax.set_title('Hardware Distribution by Type', fontsize=16)
    ax.set_xlabel('Count', fontsize=12); ax.set_ylabel('Hardware Type', fontsize=12)
    for i, v in enumerate(counts): ax.text(v + 0.5, i, str(v), color='blue', va='center', fontweight='bold')
    plt.tight_layout(); buf = io.BytesIO(); fig.savefig(buf, format='png'); plt.close(fig); buf.seek(0)
    return buf

def generate_employee_acta_word(db: Session, employee_id: int) -> io.BytesIO:
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        return None
    hardware_items = db.query(Hardware).filter(Hardware.employee_id == employee_id).all()
    license_items = db.query(License).filter(License.employee_id == employee_id).all()
    webaccess_items = db.query(WebAccess).filter(WebAccess.employee_id == employee_id).all()
    document = Document()
    title = document.add_heading('Acta de Asignación de Activos TIC', level=1)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    document.add_paragraph()
    document.add_heading('Información del Empleado', level=2)
    document.add_paragraph(f"Nombre: {employee.name}")
    document.add_paragraph(f"Departamento: {employee.department or 'N/A'}")
    document.add_paragraph(f"Cargo: {employee.position or 'N/A'}")
    document.add_paragraph(f"Fecha de Generación: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    document.add_paragraph()
    document.add_heading('Equipos de Hardware Asignados', level=2)
    if hardware_items:
        table = document.add_table(rows=1, cols=4); table.style = 'TableGrid'
        hdr_cells = table.rows[0].cells; hdr_cells[0].text = 'Tipo'; hdr_cells[1].text = 'Marca'; hdr_cells[2].text = 'Serial'; hdr_cells[3].text = 'Ubicación'
        for item in hardware_items:
            row_cells = table.add_row().cells; row_cells[0].text = item.type; row_cells[1].text = item.brand or ''; row_cells[2].text = item.serial_number; row_cells[3].text = item.location or ''
    else: document.add_paragraph("No hay equipos de hardware asignados.")
    document.add_paragraph()
    document.add_heading('Licencias de Software Asignadas', level=2)
    if license_items:
        table = document.add_table(rows=1, cols=3); table.style = 'TableGrid'
        hdr_cells = table.rows[0].cells; hdr_cells[0].text = 'Software'; hdr_cells[1].text = 'Clave'; hdr_cells[2].text = 'Expiración'
        for item in license_items:
            row_cells = table.add_row().cells; row_cells[0].text = item.software_name; row_cells[1].text = item.license_key; row_cells[2].text = item.expiration_date.strftime('%Y-%m-%d') if item.expiration_date else 'N/A'
    else: document.add_paragraph("No hay licencias de software asignadas.")
    document.add_paragraph()
    document.add_heading('Accesos Web Asignados', level=2)
    if webaccess_items:
        table = document.add_table(rows=1, cols=3); table.style = 'TableGrid'
        hdr_cells = table.rows[0].cells; hdr_cells[0].text = 'Servicio'; hdr_cells[1].text = 'URL'; hdr_cells[2].text = 'Usuario'
        for item in webaccess_items:
            row_cells = table.add_row().cells; row_cells[0].text = item.service_name; row_cells[1].text = item.url; row_cells[2].text = item.access_username
    else: document.add_paragraph("No hay accesos web asignados.")
    document.add_paragraph()
    document.add_page_break()
    document.add_heading('Firmas', level=2)
    document.add_paragraph("\n\n_________________________\nFirma del Empleado: " + employee.name)
    document.add_paragraph("\n\n_________________________\nFirma del Responsable (Admin)")
    file_stream = io.BytesIO(); document.save(file_stream); file_stream.seek(0)
    return file_stream

# New function for Excel report
def generate_full_excel_report(db: Session) -> io.BytesIO:
    employees_data = db.query(Employee).all()
    hardware_data = db.query(Hardware).all()
    licenses_data = db.query(License).all()
    webaccess_data = db.query(WebAccess).all()

    df_employees = pd.DataFrame([{"ID": e.id, "Name": e.name, "Department": e.department, "Position": e.position} for e in employees_data])
    df_hardware = pd.DataFrame([{"ID": h.id, "Type": h.type, "Brand": h.brand, "Serial Number": h.serial_number, "Location": h.location, "Assigned Employee ID": h.employee_id, "Assigned Employee Name": h.assigned_employee.name if h.assigned_employee else None } for h in hardware_data])
    df_licenses = pd.DataFrame([{"ID": l.id, "Software Name": l.software_name, "License Key": l.license_key, "Purchase Date": l.purchase_date.strftime('%Y-%m-%d') if l.purchase_date else None, "Expiration Date": l.expiration_date.strftime('%Y-%m-%d') if l.expiration_date else None, "Assigned Employee ID": l.employee_id, "Assigned Employee Name": l.assigned_employee.name if l.assigned_employee else None } for l in licenses_data])
    df_webaccess = pd.DataFrame([{"ID": w.id, "Service Name": w.service_name, "URL": w.url, "Access Username": w.access_username, "Assigned Employee ID": w.employee_id, "Assigned Employee Name": w.assigned_employee.name if w.assigned_employee else None } for w in webaccess_data])

    output_stream = io.BytesIO()
    with pd.ExcelWriter(output_stream, engine='openpyxl') as writer:
        df_employees.to_excel(writer, sheet_name='Employees', index=False)
        df_hardware.to_excel(writer, sheet_name='Hardware', index=False)
        df_licenses.to_excel(writer, sheet_name='Licenses', index=False)
        df_webaccess.to_excel(writer, sheet_name='Web Accesses', index=False)
    output_stream.seek(0)
    return output_stream
