package py.edu.ventas_digitales.restcontrollers;

import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import py.edu.ventas_digitales.config.JasperConfig;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReporteRestController {

    private final JasperConfig jasperConfig;
    private final DataSource dataSource;

    @GetMapping("/ventas/pdf")
    public ResponseEntity<Resource> generarReporteVentasConSql(
            @RequestParam(required = false, defaultValue = "") String fechaInicio,
            @RequestParam(required = false, defaultValue = "") String fechaFin) {

        try (Connection con = dataSource.getConnection()) {
            Map<String, Object> parametros = new HashMap<>();
            parametros.put("FECHA_INICIO", fechaInicio);
            parametros.put("FECHA_FIN", fechaFin);

            return jasperConfig.reportePdf(parametros, "reporte_venta", "reporte_venta", con);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
