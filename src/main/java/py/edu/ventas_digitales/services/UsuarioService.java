package py.edu.ventas_digitales.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import py.edu.ventas_digitales.models.Usuario;
import py.edu.ventas_digitales.repositories.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private UsuarioRepository uRepository;

    UsuarioService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> getAllUsuarios() {
        return uRepository.findAll();
    }

    public Usuario getUsuarioById(Long id) {
        return uRepository.findById(id).orElse(null);
    }

    public Usuario saveUsuario(Usuario usuario) {
        if (usuario.getId() == null && usuario.getTipoUsuario() == null) {
            usuario.setTipoUsuario("CLIENTE");
        }
        return uRepository.save(usuario);
    }

    public Usuario actualizarDatosUsuario(Long id, Usuario usuarioActualizado) {
        Usuario usuarioExistente = uRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuarioActualizado.getNombre() != null) {
            usuarioExistente.setNombre(usuarioActualizado.getNombre());
        }
        if (usuarioActualizado.getApellido() != null) {
            usuarioExistente.setApellido(usuarioActualizado.getApellido());
        }
        if (usuarioActualizado.getDocumento() != null) {
            usuarioExistente.setDocumento(usuarioActualizado.getDocumento());
        }
        if (usuarioActualizado.getTelefono() != null) {
            usuarioExistente.setTelefono(usuarioActualizado.getTelefono());
        }
        if (usuarioActualizado.getEmail() != null) {
            usuarioExistente.setEmail(usuarioActualizado.getEmail());
        }
        if (usuarioActualizado.getDireccion() != null) {
            usuarioExistente.setDireccion(usuarioActualizado.getDireccion());
        }
        if (usuarioActualizado.getContrasenha() != null && !usuarioActualizado.getContrasenha().isEmpty()) {
            usuarioExistente.setContrasenha(passwordEncoder.encode(usuarioActualizado.getContrasenha()));
        }
        return uRepository.save(usuarioExistente);
    }

    public boolean deleteUsario(Long id) {
        if (uRepository.existsById(id)) {
            uRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
