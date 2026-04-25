package com.chefia.app.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.chefia.app.dto.RecetaDTO;
import com.chefia.app.model.Receta;
import com.chefia.app.repository.RecetaRepository;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class RecetaService {

    private final RestClient restClient;
    private final RecetaRepository recetaRepository;
    private final ObjectMapper objectMapper;

    @Value("${GROQ_API_KEY}")
    private String apiKey;

    private final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

    public RecetaService(RestClient restClient, RecetaRepository recetaRepository, ObjectMapper objectMapper) {
        this.restClient = restClient;
        this.recetaRepository = recetaRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Se comunica con la API de Groq para obtener 3 sugerencias de recetas.
     */
    public List<RecetaDTO> obtenerSugerenciasDeIA(List<String> ingredientes) {
        String listaIngredientes = String.join(", ", ingredientes);
        
        // Prompt optimizado para recibir un JSON limpio que Jackson pueda parsear
        String prompt = """
            Genera 3 recetas utilizando únicamente o principalmente estos ingredientes: %s.
            Responde exclusivamente en formato JSON, un array de objetos con esta estructura:
            [
              {
                "nombre": "Nombre del plato",
                "ingredientes": "lista de ingredientes usados",
                "pasos": "instrucciones detalladas de preparación"
              }
            ]
            No incluyas explicaciones adicionales, solo el array JSON.
            """.formatted(listaIngredientes);

        try {
            String response = restClient.post()
                    .uri(GROQ_URL)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "model", "llama3-8b-8192",
                            "messages", List.of(Map.of("role", "user", "content", prompt)),
                            "temperature", 0.7
                    ))
                    .retrieve()
                    .body(String.class);

            return extraerRecetasDeJson(response);
        } catch (Exception e) {
            // Loguear el error en consola para debugging
            System.err.println("Error al conectar con Groq: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Parsea la respuesta compleja de la API de Groq al listado de DTOs.
     */
    private List<RecetaDTO> extraerRecetasDeJson(String response) throws Exception {
        JsonNode root = objectMapper.readTree(response);
        // Groq devuelve el contenido dentro de choices[0].message.content
        String contenidoJson = root.path("choices").get(0).path("message").path("content").stringValue();
        
        // Si textValue fue null, le asignamos un String vacío para que no explote el .replace()
        if (contenidoJson == null) {
            contenidoJson = ""; 
        }

        return objectMapper.readValue(contenidoJson, new TypeReference<List<RecetaDTO>>() {});
    }

    /**
     * Guarda la receta seleccionada en la base de datos PostgreSQL.
     */
    public void guardarEnBaseDeDatos(RecetaDTO dto) {
        Receta receta = Receta.builder()
                .nombre(dto.getNombre())
                .ingredientes(dto.getIngredientes())
                .instrucciones(dto.getPasos())
                .build();
        
        recetaRepository.save(receta);
    }
    
}
