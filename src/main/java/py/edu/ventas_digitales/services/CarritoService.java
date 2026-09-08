package py.edu.ventas_digitales.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import py.edu.ventas_digitales.models.Carrito;
import py.edu.ventas_digitales.models.CarritoDetalle;
import py.edu.ventas_digitales.models.Producto;
import py.edu.ventas_digitales.models.Usuario;
import py.edu.ventas_digitales.repositories.CarritoDetalleRepository;
import py.edu.ventas_digitales.repositories.CarritoRepository;
import py.edu.ventas_digitales.repositories.ProductoRepository;
import py.edu.ventas_digitales.repositories.UsuarioRepository;

@Service
public class CarritoService {

    private final CarritoRepository carritoRepository;
    private final CarritoDetalleRepository carritoDetalleRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public CarritoService(CarritoRepository carritoRepository, CarritoDetalleRepository carritoDetalleRepository,
            ProductoRepository productoRepository, UsuarioRepository usuarioRepository) {
        this.carritoRepository = carritoRepository;
        this.carritoDetalleRepository = carritoDetalleRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Carrito obtenerCarritoActivo(Long usuarioId) {
        return carritoRepository.findByUsuarioIdAndEstado(usuarioId, "ACTIVO")
                .orElseGet(() -> {

                    Usuario usuario = usuarioRepository.findById(usuarioId)
                            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));

                    Carrito nuevoCarrito = new Carrito();
                    nuevoCarrito.setUsuario(usuario);
                    nuevoCarrito.setEstado("ACTIVO");
                    nuevoCarrito.setCodigo(UUID.randomUUID().toString());
                    nuevoCarrito.setMontoTotal(BigDecimal.ZERO);
                    nuevoCarrito.setDetalles(new ArrayList<>());

                    return carritoRepository.save(nuevoCarrito);
                });
    }

    @Transactional
    public Carrito agregarProducto(Long usuarioId, Long productoId, Integer cantidad) {
        Carrito carrito = obtenerCarritoActivo(usuarioId);
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Optional<CarritoDetalle> detalleExistente = carrito.getDetalles().stream()
                .filter(d -> d.getProducto().getId().equals(productoId)).findFirst();

        if (detalleExistente.isPresent()) {
            CarritoDetalle detalle = detalleExistente.get();
            detalle.setCantidad(detalle.getCantidad() + cantidad);
        } else {
            CarritoDetalle nuevoDetalle = new CarritoDetalle();
            nuevoDetalle.setCarrito(carrito);
            nuevoDetalle.setProducto(producto);
            nuevoDetalle.setCantidad(cantidad);
            nuevoDetalle.setPrecioUnitario(producto.getPre_venta());
            carrito.getDetalles().add(nuevoDetalle);
        }
        recalcularMontoTotal(carrito);
        return carritoRepository.save(carrito);
    }

    @Transactional
    public Carrito eliminarItemCarrito(Long usuarioId, Long detalleId) {
        Carrito carrito = obtenerCarritoActivo(usuarioId);
        carrito.getDetalles().removeIf(d -> d.getId().equals(detalleId));
        carritoDetalleRepository.deleteById(detalleId);

        recalcularMontoTotal(carrito);
        return carritoRepository.save(carrito);
    }

    private void recalcularMontoTotal(Carrito carrito) {
        BigDecimal total = carrito.getDetalles().stream()
                .map(d -> d.getPrecioUnitario().multiply(BigDecimal.valueOf(d.getCantidad())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        carrito.setMontoTotal(total);
    }

}
