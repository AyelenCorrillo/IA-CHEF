package com.chefia.app.model;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "categorias")
@ToString(exclude = "ingredients")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre")
    private String name;

    @OneToMany(mappedBy = "category")
    private List<Ingredient> ingredients;
}