package py.edu.ventas_digitales.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VentaRequestDto {
    private Long usuarioId;
    private String metodoPago;
    private List<ItemCarritoDto> items;

}
