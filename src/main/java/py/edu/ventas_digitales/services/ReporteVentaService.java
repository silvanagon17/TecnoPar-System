package py.edu.ventas_digitales.services;

import java.io.InputStream;
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

    public byte[] generarReporteVentasPdf(List<ReporteVentaDto> ventas) throws Exception {
        InputStream jrxmlStream = getClass().getResourceAsStream("/reportes/reporte_venta.jrxml");
        if (jrxmlStream == null) {
            throw new IllegalArgumentException("No se encontró el archivo /reportes/reporte_venta.jrxml");
        }

        InputStream logoStream = getClass().getResourceAsStream("/static/image/estatico/logoTecnoPar.png");
        Map<String, Object> parameters = new HashMap<>();
        if (logoStream != null) {
            parameters.put("LOGO_DIR", logoStream);
        }

        JasperReport jasperReport = JasperCompileManager.compileReport(jrxmlStream);
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(ventas);
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

        return JasperExportManager.exportReportToPdf(jasperPrint);
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
