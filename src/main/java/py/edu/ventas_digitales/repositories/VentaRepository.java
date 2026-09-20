package py.edu.ventas_digitales.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import py.edu.ventas_digitales.models.Venta;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByUsuarioId(Long usuarioId);

    @Query("SELECT DISTINCT v FROM Venta v LEFT JOIN FETCH v.usuario LEFT JOIN FETCH v.detalles d LEFT JOIN FETCH d.producto WHERE v.estado = :estado")
    List<Venta> findByEstado(String estado);
}
