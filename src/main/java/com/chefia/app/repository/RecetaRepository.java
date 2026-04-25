package com.chefia.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chefia.app.model.Receta;

@Repository
public interface RecetaRepository extends JpaRepository<Receta, Long> {
    // Aquí ya tenemos métodos como save(), findAll(), delete(), etc.
}
