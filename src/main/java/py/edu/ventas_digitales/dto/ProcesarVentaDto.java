package py.edu.ventas_digitales.dto;

import java.util.List;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ProcesarVentaDto {

    private CompletarPerfilDto datosPerfil;
    private String metodoPago;
    private List<ItemCarritoDto> items;

}
