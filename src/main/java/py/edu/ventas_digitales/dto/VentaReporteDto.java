package py.edu.ventas_digitales.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VentaReporteDto {

    private Long id;
    private String fecha;
    private String cliente;
    private String ciudad;
    private String metodoPago;
    private Integer cantidad;
    private BigDecimal montoTotal;
    private String usuario;

}
