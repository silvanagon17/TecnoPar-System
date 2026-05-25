package py.edu.ventas_digitales.restcontrollers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import py.edu.ventas_digitales.models.Categoria;
import py.edu.ventas_digitales.services.CategoriaService;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaRestController {

    @Autowired
    private CategoriaService cService;

    @GetMapping
    public List<Categoria> getAllCategorias() {
        return cService.getAllCategorias();
    }

    @GetMapping("/{id}")
    public Categoria getCategoriaById(@PathVariable Long id) {
        return cService.getCategoriaById(id);
    }

    @PostMapping
    public Categoria createCategoria(@RequestBody Categoria categoria) {
        return cService.saveCategoria(categoria);
    }

    @PutMapping("/{id}")
    public Categoria updateCategoria(@PathVariable Long id, @RequestBody Categoria categoriaUpdate) {
        Categoria categoriaExistente = cService.getCategoriaById(id);

        categoriaExistente.setNombreCategoria(categoriaUpdate.getNombreCategoria());
        categoriaExistente.setDescripcion(categoriaUpdate.getDescripcion());
        categoriaExistente.setEstado(categoriaUpdate.getEstado());

        return cService.saveCategoria(categoriaExistente);
    }

    @DeleteMapping("/{id}")
    public boolean deleteCategoria(@PathVariable Long id) {
        return cService.deleteCategoria(id);
    }

}
