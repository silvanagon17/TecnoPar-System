package py.edu.ventas_digitales.restcontrollers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import py.edu.ventas_digitales.dto.ProcesarVentaDto;
import py.edu.ventas_digitales.models.Venta;
import py.edu.ventas_digitales.services.VentaService;

@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VentaRestController {

    private final VentaService ventaService;

    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> registrarVenta(@PathVariable Long usuarioId, @RequestBody ProcesarVentaDto request) {
        try {
            Venta nuevaVenta = ventaService.procesarVenta(usuarioId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaVenta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
