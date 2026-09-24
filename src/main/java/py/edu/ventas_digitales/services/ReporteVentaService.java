package py.edu.ventas_digitales.services;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import py.edu.ventas_digitales.dto.VentaReporteDto;

@Service
public class ReporteVentaService {

    public byte[] generarReporteVentasPdf(List<VentaReporteDto> ventas) throws Exception {
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

}
