package com.chefia.app.controller;

import java.util.List;
import java.util.Map;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import com.chefia.app.dto.RecetaDTO;
import com.chefia.app.model.Ingredient;
import com.chefia.app.model.RecetaGuardada;
import com.chefia.app.model.Usuario;
import com.chefia.app.repository.RecetaGuardadaRepository;
import com.chefia.app.repository.RecetaRepository;
import com.chefia.app.service.RecetaService;
import com.chefia.app.service.IngredientService;
import com.chefia.app.service.RecetaGuardadaService;

@Controller
public class RecetaController {

    private final RecetaService recetaService;
    private final RecetaRepository recetaRepository;
    private final IngredientService ingredientService;
    private final RecetaGuardadaService recetaGuardadaService;
    private final RecetaGuardadaRepository recetaGuardadaRepository;

    public RecetaController(RecetaService recetaService,
            RecetaRepository recetaRepository,
            IngredientService ingredientService,
            RecetaGuardadaService recetaGuardadaService,
            RecetaGuardadaRepository recetaGuardadaRepository) {
        this.recetaService = recetaService;
        this.recetaRepository = recetaRepository;
        this.ingredientService = ingredientService;
        this.recetaGuardadaService = recetaGuardadaService;
        this.recetaGuardadaRepository = recetaGuardadaRepository;
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
    @ResponseBody
    @PostMapping("/api/recetas/guardar") // Verificá que tenga el "/api" adelante completo
    public ResponseEntity<?> guardarRecetaSegura(@RequestBody Map<String, String> payload) {
        String emailUsuario = SecurityContextHolder.getContext().getAuthentication().getName();

        String titulo = payload.get("titulo");
        String ingredientes = payload.get("ingredientes");
        String tiempo = payload.get("tiempo");
        String porciones = payload.get("porciones");
        String pasos = payload.get("pasos");

        if (titulo == null || pasos == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Faltan datos de la receta"));
        }

        recetaGuardadaService.guardarReceta(
                titulo,
                ingredientes,
                tiempo,
                porciones,
                pasos,
                emailUsuario);

        return ResponseEntity.ok(Map.of("mensaje", "¡Receta guardada con éxito!"));
    }

    /**
     * Endpoint REST seguro que devuelve las recetas favoritas del usuario
     * autenticado en formato JSON.
     */
    @ResponseBody
    @GetMapping("/api/recetas/favoritas")
    public ResponseEntity<?> obtenerMisRecetasFavoritas() {
        try {
            // Extraemos de forma segura el email del usuario autenticado mediante el token
            // JWT
            String emailUsuario = SecurityContextHolder.getContext().getAuthentication().getName();

            // Buscamos la lista en la base de datos PostgreSQL usando tu servicio ya
            // reparado
            List<RecetaGuardada> favoritas = recetaGuardadaService.obtenerHistorialPorEmail(emailUsuario);

            // Devolvemos la lista limpia con estado HTTP 200 OK
            return ResponseEntity.ok(favoritas);
        } catch (Exception e) {
            // Si llega a fallar algo internamente, devolvemos el error en formato JSON para
            // no romper el front
            return ResponseEntity.status(500).body(Map.of("error", "Error interno: " + e.getMessage()));
        }
    }

    /**
     * Endpoint REST seguro para eliminar una receta guardada por su ID único.
     */
    @ResponseBody
    @PostMapping("/api/recetas/eliminar/{id}")
    public ResponseEntity<?> eliminarRecetaFavorita(@PathVariable Long id) {
        try {
            // 1. Usamos el servicio para buscar la receta de forma segura
            RecetaGuardada receta = recetaGuardadaService.obtenerHistorialPorEmail(
                    SecurityContextHolder.getContext().getAuthentication().getName()).stream()
                    .filter(r -> r.getId().equals(id))
                    .findFirst()
                    .orElse(null);

            if (receta != null) {
                Usuario usuario = receta.getUsuario();

                // 2. Rompemos el lazo relacional en la memoria
                if (usuario != null && usuario.getRecetasGuardadas() != null) {
                    usuario.getRecetasGuardadas().remove(receta);
                }
                // 3. Mandamos la orden de borrado directo usando el repositorio que tenés en la
                // línea 150
                recetaGuardadaRepository.deleteById(receta.getId());

                return ResponseEntity.ok(Map.of("mensaje", "Receta eliminada correctamente."));
            } else {
                return ResponseEntity.status(404).body(Map.of("error", "La receta ya no existe."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error interno: " + e.getMessage()));
        }
    }

}
