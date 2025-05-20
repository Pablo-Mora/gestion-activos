package com.gestionactivos.service;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;
import java.util.Map;
import java.util.function.Function;

/**
 * Servicio para manejar operaciones relacionadas con JWT (JSON Web Token)
 */
public interface JwtService {

    /**
     * Extrae el nombre de usuario del token JWT
     * @param token Token JWT
     * @return Nombre de usuario
     */
    String extractUsername(String token);

    /**
     * Extrae la fecha de expiración del token JWT
     * @param token Token JWT
     * @return Fecha de expiración
     */
    Date extractExpiration(String token);

    /**
     * Extrae una reclamación específica del token JWT
     * @param token Token JWT
     * @param claimsResolver Función para extraer la reclamación
     * @param <T> Tipo de la reclamación
     * @return Valor de la reclamación
     */
    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

    /**
     * Extrae todas las reclamaciones del token JWT
     * @param token Token JWT
     * @return Reclamaciones
     */
    Claims extractAllClaims(String token);

    /**
     * Genera un token JWT para el usuario
     * @param userDetails Detalles del usuario
     * @return Token JWT generado
     */
    String generateToken(UserDetails userDetails);

    /**
     * Genera un token JWT para el usuario con reclamaciones adicionales
     * @param extraClaims Reclamaciones adicionales
     * @param userDetails Detalles del usuario
     * @return Token JWT generado
     */
    String generateToken(Map<String, Object> extraClaims, UserDetails userDetails);

    /**
     * Valida si un token JWT es válido para un usuario específico
     * @param token Token JWT
     * @param userDetails Detalles del usuario
     * @return true si el token es válido, false de lo contrario
     */
    boolean isTokenValid(String token, UserDetails userDetails);

    /**
     * Verifica si un token JWT ha expirado
     * @param token Token JWT
     * @return true si el token ha expirado, false de lo contrario
     */
    boolean isTokenExpired(String token);
}