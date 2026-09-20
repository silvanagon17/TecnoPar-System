package py.edu.ventas_digitales.restcontrollers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/estado")
    public ResponseEntity<List<Venta>> obtenerVentasPorEstado(String estado) {
        List<Venta> ventas = ventaService.obtenerVentasPorEstado(estado);
        return ResponseEntity.ok(ventas);
    }

    @PostMapping("/{ventaId}/finalizar")
    public ResponseEntity<?> ventaFinalizado(@PathVariable Long ventaId) {
        try {
            ventaService.cambiarEstado(ventaId, "COMPLETADO");
            return ResponseEntity.ok(Map.of("mensaje", "Pedido finalizado con éxito"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

}
