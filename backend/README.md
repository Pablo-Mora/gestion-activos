# Backend - Sistema de Gestión de Activos TIC

Este módulo contiene la API REST desarrollada con Spring Boot 3 y Java 17.

## Características

*   API RESTful siguiendo el patrón MVC.
*   Seguridad con Spring Security y JWT.
*   Validaciones con anotaciones.
*   Base de datos H2 embebida.
*   Exportación de datos a Excel (Apache POI).
*   Roles: ADMIN, USER.

## Requisitos Previos

*   JDK 17 o superior.
*   Apache Maven 3.6.x o superior.

## Cómo Ejecutar

1.  Navegar al directorio `backend/`.
    ```bash
    cd backend
    ```
2.  Compilar y empaquetar el proyecto usando Maven:
    ```bash
    mvn clean package
    ```
3.  Ejecutar la aplicación:
    ```bash
    java -jar target/activos-tic-0.0.1-SNAPSHOT.jar
    ```
La aplicación estará disponible en `http://localhost:8080`.

## Endpoints Principales

*   `POST /api/auth/login`: Autenticación de usuarios.
*   `POST /api/auth/register`: Registro de nuevos usuarios (solo ADMIN).
*   `/api/employees/**`: CRUD para Empleados.
*   `/api/hardware/**`: CRUD para Hardware.
*   `/api/licenses/**`: CRUD para Licencias.
*   `/api/web-accesses/**`: CRUD para Accesos Web.
*   `GET /api/export/excel`: Exportar todos los datos a Excel (solo ADMIN).

## H2 Console
*   URL: `http://localhost:8080/h2-console`
*   JDBC URL: `jdbc:h2:mem:activos_tic_db`
*   User Name: `sa`
*   Password: (dejar en blanco)

## Dependencias Clave (Maven)
*   `spring-boot-starter-web`
*   `spring-boot-starter-data-jpa`
*   `spring-boot-starter-security`
*   `spring-boot-starter-validation`
*   `com.h2database:h2`
*   `io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson`
*   `org.apache.poi:poi-ooxml`
*   `org.projectlombok:lombok`
