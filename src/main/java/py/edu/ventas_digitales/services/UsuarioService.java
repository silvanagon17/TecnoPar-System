package py.edu.ventas_digitales.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import py.edu.ventas_digitales.models.Usuario;
import py.edu.ventas_digitales.repositories.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository uRepository;

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

    public boolean deleteUsario(Long id) {
        if (uRepository.existsById(id)) {
            uRepository.deleteById(id);
            return true;
        }
        return false;
    }

}
