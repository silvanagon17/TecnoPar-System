package py.edu.ventas_digitales.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReporteStockDto {

    private Long id;
    private String codigo;
    private String nombreProducto;
    private Integer stock;
    private String usuario;

}
