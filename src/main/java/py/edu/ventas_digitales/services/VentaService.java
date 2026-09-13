package py.edu.ventas_digitales.services;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import py.edu.ventas_digitales.dto.ItemCarritoDto;
import py.edu.ventas_digitales.dto.VentaRequestDto;
import py.edu.ventas_digitales.models.DetalleVenta;
import py.edu.ventas_digitales.models.Producto;
import py.edu.ventas_digitales.models.Usuario;
import py.edu.ventas_digitales.models.Venta;
import py.edu.ventas_digitales.repositories.ProductoRepository;
import py.edu.ventas_digitales.repositories.UsuarioRepository;
import py.edu.ventas_digitales.repositories.VentaRepository;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Venta procesarVenta(VentaRequestDto request) {
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado ID: " + request.getUsuarioId()));

        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setMetodoPago(request.getMetodoPago());
        venta.setEstado("COMPLETADO");
        venta.setPrecioTotal(BigDecimal.ZERO);

        BigDecimal totalAcumulado = BigDecimal.ZERO;
        for (ItemCarritoDto item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado ID: " + item.getProductoId()));

            if (producto.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombreProducto());
            }
            producto.setStock(producto.getStock() - item.getCantidad());

            BigDecimal precioUnitario = producto.getPre_venta();
            BigDecimal subtotal = precioUnitario.multiply(BigDecimal.valueOf(item.getCantidad()));

            DetalleVenta detalle = new DetalleVenta();
            detalle.setVenta(venta);
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(precioUnitario);
            detalle.setSubTotal(subtotal);

            venta.getDetalles().add(detalle);
            totalAcumulado = totalAcumulado.add(subtotal);
        }
        venta.setPrecioTotal(totalAcumulado);
        return ventaRepository.save(venta);
    }

}
