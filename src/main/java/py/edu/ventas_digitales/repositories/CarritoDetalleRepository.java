package py.edu.ventas_digitales.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import py.edu.ventas_digitales.models.CarritoDetalle;

public interface CarritoDetalleRepository extends JpaRepository<CarritoDetalle, Long> {

}
