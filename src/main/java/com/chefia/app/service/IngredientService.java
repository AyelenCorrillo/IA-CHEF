package com.chefia.app.service;

import com.chefia.app.model.Ingredient;
import com.chefia.app.repository.IngredientRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class IngredientService {

    @Autowired
    private IngredientRepository ingredientRepository; 

    public List<Ingredient> getIngredients() {
        return ingredientRepository.findAll();
    }

    public List<Ingredient> getIngredientsByCategory(String categoryName) {
    return ingredientRepository.findByCategory_Name(categoryName);
}
}