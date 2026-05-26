package py.edu.ventas_digitales.config;

import java.io.InputStream;
import java.sql.Connection;
import java.util.Map;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;

@Component
public class JasperConfig {

    public ResponseEntity<Resource> reportePdf(Map<String, Object> parametros, String archivoJasper, String nombreFinal,
            Connection con) {
        try {
            InputStream stream = getClass().getResourceAsStream("/reports/" + archivoJasper + ".jasper");
            if (stream == null) {
                throw new IllegalArgumentException("No se encontro el archivo");
            }

            JasperPrint print = JasperFillManager.fillReport(stream, parametros, con);

            byte[] reporte = JasperExportManager.exportReportToPdf(print);
            String newFilename = nombreFinal + ".pdf";
            ContentDisposition contentDisposition = ContentDisposition.builder("inline").filename(newFilename).build();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentDisposition(contentDisposition);

            return ResponseEntity.ok().contentLength((long) reporte.length).contentType(MediaType.APPLICATION_PDF)
                    .headers(headers).body(new ByteArrayResource(reporte));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
