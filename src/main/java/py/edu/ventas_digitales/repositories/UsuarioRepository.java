package py.edu.ventas_digitales.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import py.edu.ventas_digitales.models.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

}
