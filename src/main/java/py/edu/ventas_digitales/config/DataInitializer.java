package py.edu.ventas_digitales.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import py.edu.ventas_digitales.models.Usuario;
import py.edu.ventas_digitales.repositories.UsuarioRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String emailAdmin = "silvana@tecnopar.com";

        if (!usuarioRepository.existsByEmail(emailAdmin)) {
            Usuario admin = new Usuario();
            admin.setNombre("Admin");
            admin.setApellido("Principal");
            admin.setEmail(emailAdmin);
            admin.setContrasenha(passwordEncoder.encode("admin123"));
            admin.setTipoUsuario("ADMIN");

            usuarioRepository.save(admin);
            System.out.println(">>> Usuario Administrador inicial creado exitosamente");
        }
    }

}
