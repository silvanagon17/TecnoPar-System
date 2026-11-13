package py.edu.ventas_digitales.services;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import py.edu.ventas_digitales.dto.ReporteVentaDto;
import py.edu.ventas_digitales.dto.TicketItemDto;
import py.edu.ventas_digitales.models.DetalleVenta;
import py.edu.ventas_digitales.models.Venta;
import py.edu.ventas_digitales.repositories.VentaRepository;

@Service
public class ReporteVentaService {

    @Autowired
    private VentaRepository ventaRepository;

    public byte[] generarReporteVentasPdf(List<ReporteVentaDto> ventas, String titulo, LocalDateTime fechaInicio,
            LocalDateTime fechaFin, String metodoPago) throws Exception {
        InputStream jrxmlStream = getClass().getResourceAsStream("/reportes/reporte_venta.jrxml");
        if (jrxmlStream == null) {
            throw new IllegalArgumentException("No se encontró el archivo /reportes/reporte_venta.jrxml");
        }

        InputStream logoStream = getClass().getResourceAsStream("/static/image/estatico/logoTecnoPar.png");
        Map<String, Object> parameters = new HashMap<>();
        if (logoStream != null) {
            parameters.put("LOGO_DIR", logoStream);
        }

        parameters.put("TITULO_REPORTE", titulo);

        String textoFechas = "Historial Completo";
        if (fechaInicio != null && fechaFin != null) {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            textoFechas = "Desde: " + fechaInicio.format(dtf) + " - Hasta: " + fechaFin.format(dtf);
        }
        parameters.put("FILTRO_FECHAS", textoFechas);

        String textoPago = (metodoPago != null && !metodoPago.isEmpty()) ? metodoPago : "Todos los métodos";
        parameters.put("FILTRO_PAGO", textoPago);

        JasperReport jasperReport = JasperCompileManager.compileReport(jrxmlStream);
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(ventas);
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

    public List<ReporteVentaDto> generarReporteVentasDelMes(String nombreUsuarioLogueado) {
        List<Venta> ventasDelMes = ventaRepository.findVentasDelMes("COMPLETADO");
        List<ReporteVentaDto> listaReporte = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (Venta v : ventasDelMes) {
            if (v.getEstado() != null && v.getEstado().equalsIgnoreCase("PENDIENTE")) {
                continue;
            }

            String nombreCompleto = "Sin Cliente";
            if (v.getUsuario() != null) {
                String nombre = v.getUsuario().getNombre() != null ? v.getUsuario().getNombre() : "";
                String apellido = v.getUsuario().getApellido() != null ? v.getUsuario().getApellido() : "";
                nombreCompleto = (nombre + " " + apellido);
            }

            String direccion = (v.getUsuario() != null && v.getUsuario().getDireccion() != null)
                    ? v.getUsuario().getDireccion()
                    : "";
            String ciudad = direccion.contains(",") ? direccion.split(",")[0].trim() : direccion;

            int totalArticulos = 0;
            if (v.getDetalles() != null) {
                for (DetalleVenta det : v.getDetalles()) {
                    if (det.getCantidad() != null) {
                        totalArticulos += det.getCantidad();
                    }
                }
            }

            String fechaFormateada = (v.getFechaVenta() != null) ? v.getFechaVenta().format(formatter) : "";

            ReporteVentaDto dto = new ReporteVentaDto();
            dto.setId(v.getId());
            dto.setFecha(fechaFormateada);
            dto.setCliente(nombreCompleto.isEmpty() ? "Sin Nombre" : nombreCompleto);
            dto.setCiudad(ciudad);
            dto.setMetodoPago(v.getMetodoPago() != null ? v.getMetodoPago() : "Efectivo");
            dto.setCantidad(totalArticulos);
            dto.setMontoTotal(v.getPrecioTotal());
            dto.setUsuario(nombreUsuarioLogueado != null ? nombreUsuarioLogueado : "Admin");

            listaReporte.add(dto);
        }

        return listaReporte;
    }

    public byte[] generarTicketVentaPdf(Long ventaId) throws Exception {
        Venta venta = ventaRepository.findById(ventaId)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con ID: " + ventaId));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        InputStream logoStream = getClass().getResourceAsStream("/static/image/estatico/logoTecnoPar.png");
        Map<String, Object> parametrosCabecera = new HashMap<>();
        if (logoStream != null) {
            parametrosCabecera.put("LOGO_DIR", logoStream);
        }
        parametrosCabecera.put("venta_id", venta.getId());

        if (venta.getUsuario() != null) {
            parametrosCabecera.put("nombre",
                    venta.getUsuario().getNombre() != null ? venta.getUsuario().getNombre() : "");
            parametrosCabecera.put("apellido",
                    venta.getUsuario().getApellido() != null ? venta.getUsuario().getApellido() : "");
            parametrosCabecera.put("documento",
                    venta.getUsuario().getDocumento() != null ? venta.getUsuario().getDocumento() : "");

            parametrosCabecera.put("email", venta.getUsuario().getEmail() != null ? venta.getUsuario().getEmail() : "");
            parametrosCabecera.put("telefono",
                    venta.getUsuario().getTelefono() != null ? venta.getUsuario().getTelefono() : "");
        } else {
            parametrosCabecera.put("nombre", "Sin Nombre");
            parametrosCabecera.put("apellido", "");
            parametrosCabecera.put("documento", "");
            parametrosCabecera.put("email", "");
            parametrosCabecera.put("telefono", "");
        }

        parametrosCabecera.put("metodo_pago", venta.getMetodoPago() != null ? venta.getMetodoPago() : "Efectivo");
        parametrosCabecera.put("fecha_venta",
                venta.getFechaVenta() != null ? venta.getFechaVenta().format(formatter) : "");

        List<TicketItemDto> itemsDetalle = new ArrayList<>();
        if (venta.getDetalles() != null) {
            for (DetalleVenta det : venta.getDetalles()) {
                TicketItemDto item = new TicketItemDto();
                item.setProducto(det.getProducto() != null ? det.getProducto().getNombreProducto() : "Producto");
                item.setCantidad(det.getCantidad());
                item.setPrecio_uni(det.getPrecioUnitario());
                item.setSub_total(det.getSubTotal());
                item.setTotal(venta.getPrecioTotal());
                itemsDetalle.add(item);
            }
        }

        InputStream jrxmlStream = getClass().getResourceAsStream("/reportes/comprobante_compra.jrxml");
        if (jrxmlStream == null) {
            throw new IllegalArgumentException("No se encontró el archivo /reportes/comprobante_compra.jrxml");
        }

        JasperReport jasperReport = JasperCompileManager.compileReport(jrxmlStream);
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(itemsDetalle);
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parametrosCabecera, dataSource);

        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

}
