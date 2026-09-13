package py.edu.ventas_digitales.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import py.edu.ventas_digitales.models.Venta;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByUsuarioId(Long usuarioId);
}
