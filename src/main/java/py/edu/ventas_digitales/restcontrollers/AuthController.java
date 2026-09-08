package py.edu.ventas_digitales.restcontrollers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import py.edu.ventas_digitales.config.JwtProvider;
import py.edu.ventas_digitales.dto.AuthResponseDto;
import py.edu.ventas_digitales.dto.LoginDto;
import py.edu.ventas_digitales.dto.RegistroDto;
import py.edu.ventas_digitales.models.Usuario;
import py.edu.ventas_digitales.repositories.UsuarioRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginDto loginDto) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getContrasenha()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtProvider.generateToken(authentication);

        // Obtenemos el usuario para conocer su tipoUsuario
        Usuario usuario = usuarioRepository.findByEmail(loginDto.getEmail()).orElse(null);
        String tipoUsuario = (usuario != null) ? usuario.getTipoUsuario() : "";
        String nombre = (usuario != null) ? usuario.getNombre() : "";
        String apellido = (usuario != null) ? usuario.getApellido() : "";

        return new ResponseEntity<>(new AuthResponseDto(token, tipoUsuario, nombre, apellido), HttpStatus.OK);
    }

    @PostMapping("/registro")
    public ResponseEntity<String> registar(@RequestBody RegistroDto registroDto) {
        if (usuarioRepository.existsByEmail(registroDto.getEmail())) {
            return new ResponseEntity<>("El correo electrónico ya está registrado", HttpStatus.BAD_REQUEST);
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(registroDto.geNombre());
        usuario.setApellido(registroDto.getApellido());
        usuario.setEmail(registroDto.getEmail());
        usuario.setContrasenha(passwordEncoder.encode(registroDto.getContrasenha()));
        usuario.setTipoUsuario("CLIENTE");
        usuarioRepository.save(usuario);

        return new ResponseEntity<>("Usuario registrado exitosamente", HttpStatus.CREATED);
    }
}
