package py.edu.ventas_digitales.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import py.edu.ventas_digitales.models.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @Query("SELECT p FROM Producto p WHERE p.stock <= :stockLimite")
    List<Producto> findProductosStockBajo(@Param("stockLimite") Integer stockLimite);
}
