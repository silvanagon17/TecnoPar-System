package py.edu.ventas_digitales.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import py.edu.ventas_digitales.models.DetalleVenta;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {

}
