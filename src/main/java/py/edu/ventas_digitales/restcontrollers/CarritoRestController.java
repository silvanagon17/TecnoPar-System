package py.edu.ventas_digitales.restcontrollers;

import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import py.edu.ventas_digitales.models.Carrito;
import py.edu.ventas_digitales.models.Usuario;
import py.edu.ventas_digitales.repositories.UsuarioRepository;
import py.edu.ventas_digitales.services.CarritoService;

@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "*")
public class CarritoRestController {

    private final CarritoService carritoService;
    private final UsuarioRepository usuarioRepository;

    public CarritoRestController(CarritoService carritoService, UsuarioRepository usuarioRepository) {
        this.carritoService = carritoService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/mi-carrito")
    public ResponseEntity<?> obtenerCarrito(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token no válido o no proporcionado");
            }

            String identificador = authentication.getName();

            Usuario usuario = usuarioRepository.findByEmail(identificador)
                    .orElseGet(() -> {
                        try {
                            Long id = Long.parseLong(identificador);
                            return usuarioRepository.findById(id).orElse(null);
                        } catch (NumberFormatException e) {
                            return null;
                        }
                    });

            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontró el usuario asociado al token: " + identificador);
            }

            Carrito carrito = carritoService.obtenerCarritoActivo(usuario.getId());
            return ResponseEntity.ok(carrito);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno en el servidor: " + e.getMessage());
        }
    }

    @PostMapping("/agregar")
    public ResponseEntity<Carrito> agregarProductoCarrito(
            Authentication authentication,
            @RequestParam Long productoId,
            @RequestParam(defaultValue = "1") Integer cantidad) {

        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ResponseEntity.ok(carritoService.agregarProducto(usuario.getId(), productoId, cantidad));
    }

    @DeleteMapping("/item/{detalleId}")
    public ResponseEntity<?> eliminarItem(
            Authentication authentication,
            @PathVariable Long detalleId) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String identificador = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmail(identificador)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return ResponseEntity.ok(carritoService.eliminarItemCarrito(usuario.getId(), detalleId));
    }

}
