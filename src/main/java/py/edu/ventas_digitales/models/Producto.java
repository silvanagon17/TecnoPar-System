package py.edu.ventas_digitales.models;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "producto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_producto", length = 150, nullable = false)
    private String nombreProducto;

    @Column(name = "descripcion", length = 215, nullable = false)
    private String descripcion;

    @Column(name = "codigo", length = 45, nullable = false, unique = true)
    private String codigo;

    @Column(name = "pre_venta", nullable = false, precision = 10, scale = 2)
    private BigDecimal pre_venta;

    @Column(name = "stock", nullable = false)
    private int stock;

    @Column(name = "estado", length = 45, nullable = false)
    private String estado;

    @Column(length = 300, nullable = false)
    private String url_imagen;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;
}
