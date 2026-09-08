package py.edu.ventas_digitales.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import py.edu.ventas_digitales.models.Usuario;
import py.edu.ventas_digitales.repositories.UsuarioRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con el email: " + email));

        String rol = (usuario.getTipoUsuario() != null && !usuario.getTipoUsuario().isEmpty())
                ? usuario.getTipoUsuario()
                : "CLIENTE";

        return new User(
                usuario.getEmail(),
                usuario.getContrasenha(),
                List.of(new SimpleGrantedAuthority(rol)));
    }

}
