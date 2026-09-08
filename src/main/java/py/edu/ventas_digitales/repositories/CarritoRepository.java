package py.edu.ventas_digitales.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import py.edu.ventas_digitales.models.Carrito;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {

    Optional<Carrito> findByUsuarioIdAndEstado(Long usuarioId, String estado);

}
