package com.chefia.app.service;

import com.chefia.app.model.Usuario;
import com.chefia.app.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Instanciamos el encriptador oficial de Spring Security
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // REGISTRO SEGURO
    public Usuario registrarUsuario(Usuario usuario) {
        // Verificamos si el email ya existe para que no rompa la DB por restricción UNIQUE
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya se encuentra registrado");
        }
        
        // Encriptamos la contraseña antes de persistir
        String passwordEncriptada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passwordEncriptada);
        
        return usuarioRepository.save(usuario);
    }

    // VERIFICACIÓN DE LOGIN
    public Optional<Usuario> verificarCredenciales(String email, String passwordTextoPlano) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // BCrypt compara el texto plano con el hash de la DB de manera segura
            if (passwordEncoder.matches(passwordTextoPlano, usuario.getPassword())) {
                return Optional.of(usuario);
            }
        }
        return Optional.empty();
    }
    
    // Buscar por email (nos va a servir para los filtros de seguridad más adelante)
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
}
