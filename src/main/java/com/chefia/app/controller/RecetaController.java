package com.chefia.app.controller;

import java.util.List;
import java.util.Map;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.stereotype.Controller;

import com.chefia.app.dto.RecetaDTO;
import com.chefia.app.model.Ingredient;
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
    public String mostrarIndex(@RequestParam(required = false) String cat,
                           Model model) {

    List<Ingredient> ingredientes;

        if (cat != null && !cat.isEmpty()) {
    ingredientes = ingredientService.getIngredientsByCategory(cat);
        } else {
            ingredientes = ingredientService.getIngredients();
        }

    model.addAttribute("ingredientes", ingredientes);

    return "index";
}
    /**
     * Procesa los ingredientes seleccionados y pide las 3 recetas a Groq.
     */
@ResponseBody
@PostMapping("/generar-recetas")
public List<RecetaDTO> generarRecetas(
        @RequestBody Map<String, List<String>> body) {

    List<String> seleccionados = body.get("ingredientes");

    if (seleccionados == null || seleccionados.size() < 2) {
        return List.of();
    }

    return recetaService.obtenerSugerenciasDeIA(seleccionados);
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
