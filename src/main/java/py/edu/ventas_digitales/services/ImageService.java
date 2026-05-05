package py.edu.ventas_digitales.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService {

    private final String image_dir = "src/main/resources/static/image/";

    public String guardarImagen(MultipartFile archivo) throws IOException {
        Path uploadPath = Paths.get(image_dir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String nombreUnico = UUID.randomUUID().toString() + "_" + archivo.getOriginalFilename();

        Path rutaArchivo = uploadPath.resolve(nombreUnico);

        Files.write(rutaArchivo, archivo.getBytes());

        return "/image/" + nombreUnico;
    }

}
