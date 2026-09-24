package py.edu.ventas_digitales.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.RequiredArgsConstructor;
import py.edu.ventas_digitales.dto.CompletarPerfilDto;
import py.edu.ventas_digitales.dto.ItemCarritoDto;
import py.edu.ventas_digitales.dto.ProcesarVentaDto;
import py.edu.ventas_digitales.dto.VentaReporteDto;
import py.edu.ventas_digitales.models.Carrito;
import py.edu.ventas_digitales.models.DetalleVenta;
import py.edu.ventas_digitales.models.Producto;
import py.edu.ventas_digitales.models.Usuario;
import py.edu.ventas_digitales.models.Venta;
import py.edu.ventas_digitales.repositories.CarritoRepository;
import py.edu.ventas_digitales.repositories.ProductoRepository;
import py.edu.ventas_digitales.repositories.UsuarioRepository;
import py.edu.ventas_digitales.repositories.VentaRepository;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CarritoRepository carritoRepository;

    public List<Venta> obtenerVentasPorEstado(@RequestParam String estado) {
        return ventaRepository.findByEstado(estado);
    }

    public Venta cambiarEstado(Long ventaId, String nuevoEstado) {
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con ID: " + ventaId));
        venta.setEstado(nuevoEstado);
        return ventaRepository.save(venta);
    }

    @Transactional(rollbackFor = Exception.class)
    public Venta procesarVenta(Long usuarioId, ProcesarVentaDto request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado ID: " + usuarioId));

        if (request.getDatosPerfil() != null) {
            CompletarPerfilDto perfil = request.getDatosPerfil();

            if (perfil.getTelefono() != null)
                usuario.setTelefono(perfil.getTelefono());
            if (perfil.getDireccion() != null)
                usuario.setDireccion(perfil.getDireccion());
            if (perfil.getDocumento() != null)
                usuario.setDocumento(perfil.getDocumento());

            usuarioRepository.save(usuario);
        }

        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setMetodoPago(request.getMetodoPago());
        venta.setObservacion(request.getObservacion());
        venta.setEstado("PENDIENTE");
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
        Venta ventaGuardada = ventaRepository.save(venta);

        Optional<Carrito> carritoOpt = carritoRepository.findByUsuarioIdAndEstado(usuarioId, "ACTIVO");

        if (carritoOpt.isPresent()) {
            Carrito carrito = carritoOpt.get();
            carrito.getDetalles().clear();
            carrito.setMontoTotal(BigDecimal.ZERO);

            carritoRepository.saveAndFlush(carrito);
        }
        return ventaGuardada;
    }

    public List<VentaReporteDto> obtenerVentasParaReporte(String nombreUsuarioLogueado) {

        List<Venta> todasLasVentas = ventaRepository.findAll();
        List<VentaReporteDto> listaReporte = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (Venta venta : todasLasVentas) {

            if (venta.getEstado() != null && venta.getEstado().equalsIgnoreCase("PENDIENTE")) {
                continue;
            }

            String clienteCompleto = "Sin Cliente";
            if (venta.getUsuario() != null) {
                String nom = venta.getUsuario().getNombre() != null ? venta.getUsuario().getNombre() : "";
                String ape = venta.getUsuario().getApellido() != null ? venta.getUsuario().getApellido() : "";
                clienteCompleto = (nom + " " + ape).trim();
            }

            String direccion = (venta.getUsuario() != null && venta.getUsuario().getDireccion() != null)
                    ? venta.getUsuario().getDireccion()
                    : "";
            String ciudad = direccion.contains(",") ? direccion.split(",")[0].trim() : direccion;

            int totalArticulos = 0;
            if (venta.getDetalles() != null) {
                for (DetalleVenta det : venta.getDetalles()) {
                    if (det.getCantidad() != null) {
                        totalArticulos += det.getCantidad();
                    }
                }
            }

            String fechaFormateada = (venta.getFechaVenta() != null)
                    ? venta.getFechaVenta().format(formatter)
                    : "";

            VentaReporteDto dto = new VentaReporteDto();
            dto.setId(venta.getId());
            dto.setFecha(fechaFormateada);
            dto.setCliente(clienteCompleto.isEmpty() ? "Sin Nombre" : clienteCompleto);
            dto.setCiudad(ciudad);
            dto.setMetodoPago(venta.getMetodoPago() != null ? venta.getMetodoPago() : "Efectivo");
            dto.setCantidad(totalArticulos);
            dto.setMontoTotal(venta.getPrecioTotal());
            dto.setUsuario(nombreUsuarioLogueado != null ? nombreUsuarioLogueado : "Admin");

            listaReporte.add(dto);
        }

        return listaReporte;
    }
}
