package com.chefia.app.service;

import com.chefia.app.model.RecetaGuardada;
import com.chefia.app.model.Usuario;
import com.chefia.app.repository.RecetaGuardadaRepository;
import com.chefia.app.repository.UsuarioRepository;

import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class RecetaGuardadaService {

    private final RecetaGuardadaRepository recetaRepository;
    private final UsuarioRepository usuarioRepository;

    // Inyección por constructor (Buenas prácticas de Spring Boot)
    public RecetaGuardadaService(RecetaGuardadaRepository recetaRepository, 
                                 UsuarioRepository usuarioRepository) {
        this.recetaRepository = recetaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // Guardar receta asociándola al email del usuario autenticado
    public RecetaGuardada guardarReceta(String titulo, String cuerpoReceta, String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        RecetaGuardada nuevaReceta = new RecetaGuardada();
        nuevaReceta.setTitulo(titulo);
        nuevaReceta.setCuerpoReceta(cuerpoReceta);
        nuevaReceta.setUsuario(usuario);

        return recetaRepository.save(nuevaReceta);
    }

    // Obtener el historial completo de un usuario por su email
    public List<RecetaGuardada> obtenerHistorialPorEmail(String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return recetaRepository.findByUsuarioId(usuario.getId());
    }
}
