package py.edu.ventas_digitales.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import py.edu.ventas_digitales.models.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

}
