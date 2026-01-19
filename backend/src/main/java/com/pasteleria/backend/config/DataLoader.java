package com.pasteleria.backend.config;

import com.pasteleria.backend.models.*;
import com.pasteleria.backend.repositories.ProductRepository;
import com.pasteleria.backend.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataLoader {

  @Bean
  CommandLineRunner initData(UserRepository users,
                             ProductRepository products,
                             PasswordEncoder encoder) {
    return args -> {
      // ===== Productos =====
      if (products.count() == 0) {
        products.saveAll(List.of(
          p("Torta de Chocolate Clásica",
            "Bizcocho húmedo de cacao 1 kg con ganache de chocolate.",
            "65.00",
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
            "Tortas", true),
          p("Red Velvet",
            "Torta red velvet con frosting de queso crema.",
            "72.00",
            "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=400",
            "Tortas", true),
          p("Cheesecake de Fresa",
            "Base de galleta y coulis de fresa artesanal.",
            "45.00",
            "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400",
            "Postres", true),
          p("Tres Leches",
            "Clásico pastel tres leches con merengue flameado.",
            "58.00",
            "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400",
            "Tortas", true),
          p("Pie de Limón",
            "Relleno cítrico y merengue italiano.",
            "38.00",
            "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400",
            "Postres", true),
          p("Cupcakes Vainilla (6u)",
            "Esponjosos, con buttercream de vainilla.",
            "24.00",
            "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400",
            "Cupcakes", true),
          p("Cupcakes Chocolate (6u)",
            "Cacao 60% con frosting de chocolate.",
            "26.00",
            "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400",
            "Cupcakes", true),
          p("Brownies (6u)",
            "Brownies húmedos con nueces.",
            "22.00",
            "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400",
            "Postres", true),
          p("Alfajores (12u)",
            "Rellenos de manjar blanco y coco.",
            "28.00",
            "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400",
            "Galletas", true),
          p("Galletas Decoradas (6u)",
            "Galletas de mantequilla con glaseado real.",
            "25.00",
            "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
            "Galletas", true),
          p("Tarta de Manzana",
            "Manzana caramelizada y masa sablé.",
            "40.00",
            "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400",
            "Postres", true),
          p("Selva Negra",
            "Bizcocho de chocolate, cerezas y crema.",
            "69.00",
            "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400",
            "Tortas", true)
        ));
      }

      // ===== Usuarios por rol (ADMIN / DELIVERY / CLIENTE) =====
      if (users.findByEmail("admin@pasteleria.com").isEmpty()) {
        var u = new com.pasteleria.backend.models.User();
        u.setNombre("Administrador");
        u.setEmail("admin@pasteleria.com");
        u.setTelefono("999888777");
        u.setPassword(encoder.encode("admin123"));
        u.setRol(Role.ADMIN);
        u.setActivo(true);
        users.save(u);
      }
      if (users.findByEmail("delivery@pasteleria.com").isEmpty()) {
        var u = new com.pasteleria.backend.models.User();
        u.setNombre("Carlos Delivery");
        u.setEmail("delivery@pasteleria.com");
        u.setTelefono("999777666");
        u.setPassword(encoder.encode("delivery123"));
        u.setRol(Role.DELIVERY);
        u.setActivo(true);
        users.save(u);
      }
      if (users.findByEmail("maria@gmail.com").isEmpty()) {
        var u = new com.pasteleria.backend.models.User();
        u.setNombre("María Cliente");
        u.setEmail("maria@gmail.com");
        u.setTelefono("999666555");
        u.setPassword(encoder.encode("cliente123"));
        u.setRol(Role.CLIENTE);
        u.setActivo(true);
        users.save(u);
      }
    };
  }

  private Product p(String nombre, String desc, String precio,
                    String imagenUrl, String categoria, boolean disponible) {
    Product pr = new Product();
    pr.setNombre(nombre);
    pr.setDescripcion(desc);
    pr.setPrecio(new BigDecimal(precio));
    pr.setImagenUrl(imagenUrl);
    pr.setCategoria(categoria);
    pr.setDisponible(disponible);
    return pr;
  }
}
