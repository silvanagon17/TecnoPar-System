package py.edu.ventas_digitales.services;

import java.io.InputStream;
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
import py.edu.ventas_digitales.dto.ReporteStockDto;
import py.edu.ventas_digitales.models.Producto;
import py.edu.ventas_digitales.repositories.ProductoRepository;

@Service
public class ReporteStockService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<ReporteStockDto> obtenerProdStockCritico(String nombreUsuarioLogueado) {
        Integer limiteAlerta = 5;

        List<Producto> productoCrit = productoRepository.findProductosStockBajo(limiteAlerta);
        List<ReporteStockDto> listaReporte = new ArrayList<>();

        for (Producto p : productoCrit) {
            ReporteStockDto dto = new ReporteStockDto();
            dto.setId(p.getId());
            dto.setCodigo(p.getCodigo() != null ? p.getCodigo() : "");
            dto.setNombreProducto(p.getNombreProducto() != null ? p.getNombreProducto() : "Sin Nombre");
            dto.setStock(p.getStock() != 0 ? p.getStock() : 0);
            dto.setUsuario(nombreUsuarioLogueado != null ? nombreUsuarioLogueado : "Admin");
            listaReporte.add(dto);
        }

        return listaReporte;
    }

    public byte[] generarPdfStockCritico(List<ReporteStockDto> productos) throws Exception {
        InputStream jrxmlStream = getClass().getResourceAsStream("/reportes/reporte_stock.jrxml");
        if (jrxmlStream == null) {
            throw new IllegalArgumentException("No se encontró el archivo /reportes/reporte_stock.jrxml");
        }

        InputStream logoStream = getClass().getResourceAsStream(("/static/image/estatico/logoTecnopar.png"));
        Map<String, Object> parameters = new HashMap<>();
        if (logoStream != null) {
            parameters.put("LOGO_DIR", logoStream);
        }

        JasperReport jasperReport = JasperCompileManager.compileReport(jrxmlStream);
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(productos);
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

        return JasperExportManager.exportReportToPdf(jasperPrint);
    }

}
