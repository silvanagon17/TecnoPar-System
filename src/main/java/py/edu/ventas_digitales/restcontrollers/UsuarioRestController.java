package py.edu.ventas_digitales.restcontrollers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import py.edu.ventas_digitales.models.Usuario;
import py.edu.ventas_digitales.services.UsuarioService;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioRestController {

    private final PasswordEncoder passwordEncoder;
    @Autowired
    private UsuarioService uService;

    UsuarioRestController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return uService.getAllUsuarios();
    }

    @GetMapping("/{id}")
    public Usuario getUsuarioById(@PathVariable Long id) {
        return uService.getUsuarioById(id);
    }

    @PostMapping
    public Usuario createUsuario(@RequestBody Usuario usuario) {
        return uService.saveUsuario(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUsuario(@PathVariable Long id, @RequestBody Usuario usuarioUpdate) {
        Usuario usuarioModificado = uService.actualizarDatosUsuario(id, usuarioUpdate);
        return ResponseEntity.ok(usuarioModificado);
    }

    @DeleteMapping("/{id}")
    public boolean deleteUsuario(@PathVariable Long id) {
        return uService.deleteUsario(id);
    }
}
