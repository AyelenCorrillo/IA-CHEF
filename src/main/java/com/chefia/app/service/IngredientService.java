package com.chefia.app.service;

import com.chefia.app.model.Ingredient;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class IngredientService {

    public List<Ingredient> getIngredients() {
        return Arrays.asList(
            new Ingredient("Tomate", "Verduras", "/images/API_image/tomate.png"),
            new Ingredient("Cebolla", "Verduras", "/images/API_image/cebolla.png"),
            new Ingredient("Ajo", "Verduras", "/images/API_image/ajo.png"),
            new Ingredient("Papa", "Verduras", "/images/API_image/papa.png"),
            new Ingredient("Palta", "Frutas", "/images/API_image/palta.png"),
            new Ingredient("Limón", "Frutas", "/images/API_image/limon.png"),
            new Ingredient("Carne", "Proteinas", "/images/API_image/carne.png")
        );
    }
}