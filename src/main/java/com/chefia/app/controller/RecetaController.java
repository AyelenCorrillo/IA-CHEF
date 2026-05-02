package com.chefia.app.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.chefia.app.dto.RecetaDTO;
import com.chefia.app.repository.RecetaRepository;
import com.chefia.app.service.RecetaService;
import com.chefia.app.service.IngredientService;

@Controller
public class RecetaController {

    private final RecetaService recetaService;
    private final RecetaRepository recetaRepository;
    private final IngredientService ingredientService;


    public RecetaController(RecetaService recetaService,
                        RecetaRepository recetaRepository,
                        IngredientService ingredientService) {
    this.recetaService = recetaService;
    this.recetaRepository = recetaRepository;
    this.ingredientService = ingredientService;
    }

    /**
     * Muestra la pantalla principal con la grilla de ingredientes.
     */
    @GetMapping("/")
    public String mostrarIndex(Model model) {

    model.addAttribute("ingredientes", ingredientService.getIngredients());

    return "index";
}
    /**
     * Procesa los ingredientes seleccionados y pide las 3 recetas a Groq.
     */
    @PostMapping("/generar-recetas")
    public String generarRecetas(@RequestParam(name = "ingredientesSeleccionados", required = false) List<String> seleccionados, Model model) {
        if (seleccionados == null || seleccionados.size() < 2) {
            model.addAttribute("error", "Por favor, seleccioná al menos 2 ingredientes.");
            // Re-cargamos los ingredientes para no romper la vista
            return "redirect:/?error=true";
        }

        List<RecetaDTO> opciones = recetaService.obtenerSugerenciasDeIA(seleccionados);
        model.addAttribute("opciones", opciones);
        
        // Esta vista mostrará las 3 tarjetas de la imagen que pasaste
        return "recetas-sugeridas"; 
    }

    /**
     * Guarda la receta que el usuario eligió al tocar "Seguir pasos".
     */
    @PostMapping("/guardar-receta")
    public String guardarReceta(@ModelAttribute RecetaDTO recetaElegida) {
        recetaService.guardarEnBaseDeDatos(recetaElegida);
        // Redirigimos a la lista de "Mis Recetas"
        return "redirect:/mis-recetas";
    }

    /**
     * Lista todas las recetas guardadas en PostgreSQL.
     */
    @GetMapping("/mis-recetas")
    public String verMisRecetas(Model model) {
        model.addAttribute("recetasGuardadas", recetaRepository.findAll());
        return "mis-recetas";
    }
    
}
