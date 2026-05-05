package py.edu.ventas_digitales.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import py.edu.ventas_digitales.models.Categoria;
import py.edu.ventas_digitales.repositories.CategoriaRepository;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository cRepository;

    public List<Categoria> getAllCategorias() {
        return cRepository.findAll();
    }

    public Categoria getCategoriaById(Long id) {
        return cRepository.findById(id).orElse(null);
    }

    public Categoria saveCategoria(Categoria categoria) {
        return cRepository.save(categoria);
    }

    public boolean deleteCategoria(Long id) {
        if (cRepository.existsById(id)) {
            cRepository.deleteById(id);
            return true;
        }

        return false;
    }

}
