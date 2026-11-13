package py.edu.ventas_digitales.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import py.edu.ventas_digitales.models.Venta;

public interface VentaRepository extends JpaRepository<Venta, Long> {
        List<Venta> findByUsuarioId(Long usuarioId);

        @Query("SELECT DISTINCT v FROM Venta v LEFT JOIN FETCH v.usuario LEFT JOIN FETCH v.detalles d LEFT JOIN FETCH d.producto WHERE v.estado = :estado")
        List<Venta> findByEstado(String estado);

        @Query("SELECT DISTINCT v FROM Venta v LEFT JOIN FETCH v.usuario LEFT JOIN FETCH v.detalles d LEFT JOIN FETCH d.producto WHERE v.estado = :estado AND MONth(v.fechaVenta) = MONTH(CURRENT_DATE) AND YEAR(v.fechaVenta) = YEAR(CURRENT_DATE)")
        List<Venta> findVentasDelMes(@Param("estado") String estado);
}
