package py.edu.ventas_digitales.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", length = 80, nullable = false)
    private String nombre;

    @Column(name = "apellido", length = 80, nullable = false)
    private String apellido;

    @Column(name = "email", length = 180, nullable = false, unique = true)
    private String email;

    @Column(name = "telefono", length = 15, nullable = false, unique = true)
    private String telefono;

    @Column(name = "contrasenha", length = 100, nullable = false)
    private String contrasenha;

    @Column(name = "tipo_usuario", length = 45, nullable = false)
    private String tipoUsuario;

    @Column(name = "tipo_documento", length = 20, nullable = false)
    private String tipoDocumento;

    @Column(name = "documento", length = 15, nullable = false, unique = true)
    private String documento;

    @Column(name = "direccion", length = 100, nullable = false)
    private String direccion;

}
