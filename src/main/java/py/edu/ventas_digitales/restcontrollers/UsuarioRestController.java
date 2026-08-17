package py.edu.ventas_digitales.restcontrollers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private UsuarioService uService;

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
    public Usuario updateUsuario(@PathVariable Long id, @RequestBody Usuario usuarioUpdate) {
        Usuario usuarioExistente = uService.getUsuarioById(id);

        usuarioExistente.setNombre(usuarioUpdate.getNombre());
        usuarioExistente.setApellido(usuarioUpdate.getApellido());
        usuarioExistente.setEmail(usuarioUpdate.getEmail());
        usuarioExistente.setTelefono(usuarioUpdate.getTelefono());
        usuarioExistente.setContrasenha(usuarioUpdate.getContrasenha());
        usuarioExistente.setTipoUsuario(usuarioUpdate.getTipoUsuario());
        usuarioExistente.setTipoDocumento(usuarioUpdate.getTipoDocumento());
        usuarioExistente.setDocumento(usuarioUpdate.getDocumento());
        usuarioExistente.setDireccion(usuarioUpdate.getDireccion());

        return uService.saveUsuario(usuarioExistente);
    }

    @DeleteMapping("/{id}")
    public boolean deleteUsuario(@PathVariable Long id) {
        return uService.deleteUsario(id);
    }
}
