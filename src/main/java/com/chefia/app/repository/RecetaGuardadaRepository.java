package com.chefia.app.repository;

import com.chefia.app.model.RecetaGuardada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecetaGuardadaRepository extends JpaRepository<RecetaGuardada, Long> {
    List<RecetaGuardada> findByUsuarioId(Long usuarioId);
}
