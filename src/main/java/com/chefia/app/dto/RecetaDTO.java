package com.chefia.app.dto;

import lombok.Data;
import java.util.List;

@Data
public class RecetaDTO {

    private String nombre;

    private List<String> ingredientes;
    private List<String> pasos;
}