package com.chefia.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chefia.app.model.Ingredient;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    // Esto te permitirá buscar por categoría para tus filtros
    List<Ingredient> findByCategory(String category);
}
