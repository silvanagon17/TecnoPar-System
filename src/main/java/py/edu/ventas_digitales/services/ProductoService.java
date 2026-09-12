package py.edu.ventas_digitales.services;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public boolean deleteProducto(Long id) {
        Optional<Producto> prodOptional = pRepository.findById(id);
        if (prodOptional.isPresent()) {
            Producto producto = prodOptional.get();
            String urlImagen = producto.getUrl_imagen();
            pRepository.deleteById(id);
            borrarImagenLocal(urlImagen);
            return true;
        }
        return false;
    }

    private void borrarImagenLocal(String urlImagen) {
        if (urlImagen == null || urlImagen.isBlank())
            return;

        try {
            String nombreArchivo = urlImagen.substring(urlImagen.lastIndexOf("/") + 1);
            Path rutaArchivo = Paths.get("src/main/resources/static/image/productos").resolve(nombreArchivo)
                    .toAbsolutePath();
            Files.deleteIfExists(rutaArchivo);
        } catch (Exception e) {
            System.err.println("No se pudo eliminar el archivo de la carpeta local: " + e.getMessage());
        }
    }

}
