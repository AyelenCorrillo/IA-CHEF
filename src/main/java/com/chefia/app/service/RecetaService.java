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

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class RecetaService {

    private final RestClient restClient;
    private final RecetaRepository recetaRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${GROQ_API_KEY}")
    private String apiKey;

    private final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

    public RecetaService(RestClient restClient, RecetaRepository recetaRepository) {
        this.restClient = restClient;
        this.recetaRepository = recetaRepository;
    }

    /**
     * Se comunica con la API de Groq para obtener 3 sugerencias de recetas.
     */
    public List<RecetaDTO> obtenerSugerenciasDeIA(List<String> ingredientes) {
        String listaIngredientes = String.join(", ", ingredientes);

        // Prompt optimizado para recibir un JSON limpio que Jackson pueda parsear
        String prompt = """
                You are a professional chef AI.

                Generate exactly 3 recipes using mainly these ingredients:
                %s

                Rules:
                - Return ONLY valid JSON
                - Do not use markdown
                - Do not add explanations
                - Do not add extra text
                - Use realistic recipes
                - Include clear cooking steps

                JSON format:
                [
                    {
                        "nombre": "",
                        "ingredientes": [],
                        "pasos": []
                    }
                ]
                """.formatted(listaIngredientes);

        try {
            String response = restClient.post()
                    .uri(GROQ_URL)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "model", "llama-3.1-8b-instant",
                            "messages", List.of(Map.of("role", "user", "content", prompt)),
                            "temperature", 0.4))
                    .retrieve()
                    .body(String.class);

            
            System.out.println(response);

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
        JsonNode choices = root.path("choices");

        if (!choices.isArray() || choices.isEmpty()) {
            throw new RuntimeException("Respuesta inválida de Groq");
        }

        String contenidoJson = choices.get(0)
                .path("message")
                .path("content")
                .asText();

        if (contenidoJson == null || contenidoJson.isBlank()) {
            throw new RuntimeException("Groq devolvió contenido vacío");
        }

        return objectMapper.readValue(contenidoJson, new TypeReference<List<RecetaDTO>>() {
        });
    }

    /**
     * Guarda la receta seleccionada en la base de datos PostgreSQL.
     */
    public void guardarEnBaseDeDatos(RecetaDTO dto) {

        Receta receta = new Receta();

        receta.setNombre(dto.getNombre());

        String ingredientesTexto = String.join(", ", dto.getIngredientes());
        String pasosTexto = String.join("\n", dto.getPasos());

        receta.setIngredientes(ingredientesTexto);
        receta.setInstrucciones(pasosTexto);

        recetaRepository.save(receta);
    }

}
