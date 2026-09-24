package py.edu.ventas_digitales.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import py.edu.ventas_digitales.models.Venta;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByUsuarioId(Long usuarioId);

    @Query("SELECT DISTINCT v FROM Venta v LEFT JOIN FETCH v.usuario LEFT JOIN FETCH v.detalles d LEFT JOIN FETCH d.producto WHERE v.estado = :estado")
    List<Venta> findByEstado(String estado);

    @Query("SELECT DISTINCT v FROM Venta v " +
            "LEFT JOIN FETCH v.usuario " +
            "LEFT JOIN FETCH v.detalles d " +
            "LEFT JOIN FETCH d.producto " +
            "WHERE (:fechaInicio IS NULL OR v.fechaVenta >= :fechaInicio) " +
            "AND (:fechaFin IS NULL OR v.fechaVenta <= :fechaFin) " +
            "ORDER BY v.fechaVenta DESC")
    List<Venta> buscarVentasConFiltro(
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin);
}
