package py.edu.ventas_digitales.restcontrollers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import py.edu.ventas_digitales.models.Producto;
import py.edu.ventas_digitales.services.ImageService;
import py.edu.ventas_digitales.services.ProductoService;

@RestController
@RequestMapping("/api/productos")
public class ProductoRestController {

    @Autowired
    private ProductoService pService;

    @Autowired
    private ImageService iService;

    @GetMapping
    public List<Producto> getAllProductos() {
        return pService.getAllProductos();
    }

    @GetMapping("/{id}")
    public Producto getProductoById(@PathVariable Long id) {
        return pService.getProductoById(id);
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public Producto createProducto(
            @RequestPart("producto") Producto producto,
            @RequestPart("file") MultipartFile file) {
        try {
            String urlImage = iService.guardarImagen(file);
            producto.setUrl_imagen(urlImage);
            return pService.saveProducto(producto);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error al cargar la imagen del producto" + e.getMessage());
        }

    }

    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public Producto updateProducto(
            @PathVariable Long id,
            @RequestPart("producto") Producto productoUpdate,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            Producto productoExistente = pService.getProductoById(id);

            if (productoExistente == null) {
                throw new RuntimeException("El producto con ID " + id + " no existe");
            }

            if (productoUpdate.getNombreProducto() != null && !productoUpdate.getNombreProducto().trim().isEmpty()) {
                productoExistente.setNombreProducto(productoUpdate.getNombreProducto());
            }

            if (productoUpdate.getDescripcion() != null) {
                productoExistente.setDescripcion(productoUpdate.getDescripcion());
            }

            if (productoUpdate.getCodigo() != null && !productoUpdate.getCodigo().trim().isEmpty()) {
                productoExistente.setCodigo(productoUpdate.getCodigo());
            }

            if (productoUpdate.getPre_venta() != null) {
                productoExistente.setPre_venta(productoUpdate.getPre_venta());
            }

            if (productoUpdate.getStock() != 0) {
                productoExistente.setStock(productoUpdate.getStock());
            }

            if (productoUpdate.getEstado() != null) {
                productoExistente.setEstado(productoUpdate.getEstado());
            }

            if (productoUpdate.getCategoria() != null && productoUpdate.getCategoria().getId() != null) {
                productoExistente.setCategoria(productoUpdate.getCategoria());
            }

            if (file != null && !file.isEmpty()) {
                String nuevaUrl = iService.guardarImagen(file);
                productoExistente.setUrl_imagen(nuevaUrl);
            }

            return pService.saveProducto(productoExistente);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error al cargar la imagen del producto" + e.getMessage());
        }

    }

    @DeleteMapping("/{id}")
    public boolean deleteProducto(@PathVariable Long id) {
        return pService.deleteProducto(id);
    }

}
