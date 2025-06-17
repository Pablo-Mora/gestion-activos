# Analítica y Métricas - ActivosTIC

Este módulo proporciona servicios de análisis de datos, generación de métricas, visualizaciones y reportes para el Sistema de Gestión de Activos TIC. Está construido con Python, FastAPI, SQLAlchemy y Pandas.

## Características Principales

*   **API RESTful**: Endpoints para obtener métricas y reportes.
*   **Conexión a Base de Datos**: Se conecta a la base de datos H2 (configurada en modo archivo) utilizada por el backend de Spring Boot para acceder a los datos de activos.
*   **Métricas Agregadas**:
    *   Conteo de hardware por tipo.
    *   Conteo de empleados por departamento.
    *   Conteo de licencias por nombre de software.
*   **Visualización de Datos**:
    *   Generación y servicio de gráficos (ej. distribución de hardware por tipo como imagen PNG).
*   **Generación de Reportes**:
    *   Actas de asignación de activos por empleado en formato Word (.docx).
    *   Reporte completo multi-hoja en formato Excel (.xlsx) con listados de empleados, hardware, licencias y accesos web.

## Requisitos Previos

*   Python 3.9+
*   Pip (manejador de paquetes de Python)
*   **Base de Datos H2 (Modo Archivo)**: El backend de Spring Boot DEBE estar configurado para usar H2 en modo archivo (ej. `spring.datasource.url=jdbc:h2:file:./data/activos_tic_db`). Este módulo de analítica accederá al archivo `.mv.db` generado.
*   **H2 JDBC Driver**: El archivo JAR del driver JDBC de H2 (ej. `h2-2.1.214.jar`) debe estar presente en el directorio `analitica/lib/`.

## Configuración y Ejecución

1.  **Navegar al directorio `analitica/`**:
    ```bash
    cd analitica
    ```

2.  **Crear y Activar un Entorno Virtual (Recomendado)**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # En Linux/macOS
    # venv\Scripts\activate    # En Windows
    ```

3.  **Instalar Dependencias**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Descargar H2 JDBC Driver**:
    Si no está presente, descargue el JAR de H2 (ej. `h2-2.1.214.jar`) y colóquelo en `analitica/lib/`.
    Puede obtenerlo de Maven Central. Ejemplo con `curl`:
    ```bash
    mkdir -p lib
    curl -L -o lib/h2-2.1.214.jar https://repo1.maven.org/maven2/com/h2database/h2/2.1.214/h2-2.1.214.jar
    ```
    (El paso de instalación de dependencias ya debería haberlo hecho si se siguió el plan).

5.  **Configurar Ruta a la Base de Datos**:
    Edite el archivo `analitica/database.py`. Asegúrese de que la variable `DB_FILE_PATH` apunte correctamente a la ubicación del archivo de base de datos H2 generado por el backend (ej. `../data/activos_tic_db` si la base de datos está en `PROJECT_ROOT/data/` y `analitica/` está en `PROJECT_ROOT/analitica/`).

6.  **Ejecutar el Servidor FastAPI**:
    Desde el directorio `analitica/` (con el entorno virtual activado):
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8001
    ```
    El API de analítica estará disponible en `http://localhost:8001`. La documentación interactiva (Swagger UI) estará en `http://localhost:8001/docs`.

## Endpoints Disponibles (Principales)

*   `GET /`: Mensaje de bienvenida.
*   `GET /metrics/assets/count-by-type`: Conteo de hardware por tipo (JSON).
*   `GET /metrics/employees/count-by-department`: Conteo de empleados por departamento (JSON).
*   `GET /metrics/licenses/count-by-software`: Conteo de licencias por software (JSON).
*   `GET /metrics/assets/type-distribution-chart`: Gráfico de distribución de hardware por tipo (PNG).
*   `GET /export/acta/word/{employee_id}`: Descarga acta de empleado en Word (.docx).
*   `GET /export/report/excel`: Descarga reporte completo en Excel (.xlsx).

## Estructura del Módulo

*   `main.py`: Aplicación principal FastAPI y routers.
*   `database.py`: Configuración de conexión a la base de datos SQLAlchemy.
*   `db_models.py`: Modelos ORM de SQLAlchemy.
*   `schemas.py`: Modelos Pydantic para validación y serialización de datos API.
*   `routers/`: Contiene los módulos de routers por funcionalidad (ej. `metrics_router.py`, `export_router.py`).
*   `services/`: Lógica de negocio, análisis de datos y generación de reportes (ej. `analysis_service.py`).
*   `lib/`: Contiene el JAR del driver JDBC de H2.
*   `requirements.txt`: Dependencias de Python.
