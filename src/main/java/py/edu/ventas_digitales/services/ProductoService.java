package py.edu.ventas_digitales.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import py.edu.ventas_digitales.models.Producto;
import py.edu.ventas_digitales.repositories.ProductoRepository;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository pRepository;

    public List<Producto> getAllProductos() {
        return pRepository.findAll();
    }

    public Producto getProductoById(Long id) {
        return pRepository.findById(id).orElse(null);
    }

    public Producto saveProducto(Producto producto) {
        return pRepository.save(producto);
    }

    public boolean deleteProducto(Long id) {
        if (pRepository.existsById(id)) {
            pRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
