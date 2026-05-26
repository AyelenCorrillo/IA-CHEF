package com.chefia.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    /**
     * Responde a la URL /login y muestra el archivo login.html de Thymeleaf
     */
    @GetMapping("/login")
    public String mostrarLogin() {
        return "login"; // Busca automáticamente en templates/login.html
    }

    @GetMapping("/mis-recetas")
    public String mostrarMisRecetas() {
        return "mis-recetas"; // Retorna el archivo mis-recetas.html de templates/
    }
    
}
