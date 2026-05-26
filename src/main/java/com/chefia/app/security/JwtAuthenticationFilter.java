package com.chefia.app.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.chefia.app.service.UsuarioService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UsuarioService usuarioService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // 1. Extraer la cabecera Authorization
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Si no viene la cabecera o no empieza con "Bearer ", ignoramos y seguimos
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extraer el token puro (quitando la palabra "Bearer ")
        jwt = authHeader.substring(7);
        userEmail = jwtUtils.extractEmail(jwt);

        // 3. Si hay un email y el usuario no está ya autenticado en el contexto actual
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Buscamos si el usuario existe en nuestra base de datos PostgreSQL
            var usuarioOpt = usuarioService.buscarPorEmail(userEmail);
            
            if (usuarioOpt.isPresent() && jwtUtils.validateToken(jwt, userEmail)) {
                // Creamos un objeto UserDetails simétrico para que Spring Security lo entienda
                UserDetails userDetails = new User(usuarioOpt.get().getEmail(), usuarioOpt.get().getPassword(), Collections.emptyList());
                
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Seteamos al usuario en el contexto global de seguridad de la petición actual
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // Continuar con los demás filtros
        filterChain.doFilter(request, response);
    }
    
}
