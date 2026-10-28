package py.edu.ventas_digitales.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketItemDto {

    private String producto;
    private Integer cantidad;
    private BigDecimal precio_uni;
    private BigDecimal sub_total;
    private BigDecimal total;
}
