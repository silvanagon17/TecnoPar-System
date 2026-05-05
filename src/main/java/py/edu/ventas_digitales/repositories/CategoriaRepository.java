package py.edu.ventas_digitales.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import py.edu.ventas_digitales.models.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

}
