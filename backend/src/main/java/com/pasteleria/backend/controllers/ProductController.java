package com.pasteleria.backend.controllers;

import com.pasteleria.backend.models.Product;
import com.pasteleria.backend.services.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de productos
 * Endpoints: /api/products/*
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * GET /api/products/public/all
     * Obtiene todos los productos disponibles (público)
     */
    @GetMapping("/public/all")
    public ResponseEntity<List<Product>> getAllAvailableProducts() {
        List<Product> products = productService.getAvailableProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/products/public/{id}
     * Obtiene un producto por ID (público)
     */
    @GetMapping("/public/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * GET /api/products/admin/all
     * Obtiene todos los productos (incluye no disponibles) - Solo ADMIN
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * POST /api/products/admin
     * Crea un nuevo producto - Solo ADMIN
     */
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProduct(@Valid @RequestBody Product product) {
        try {
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * PUT /api/products/admin/{id}
     * Actualiza un producto - Solo ADMIN
     */
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        try {
            Product updatedProduct = productService.updateProduct(id, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * DELETE /api/products/admin/{id}
     * Elimina un producto - Solo ADMIN
     */
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(new SuccessResponse("Producto eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * PATCH /api/products/admin/{id}/toggle-availability
     * Cambia la disponibilidad de un producto - Solo ADMIN
     */
    @PatchMapping("/admin/{id}/toggle-availability")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleAvailability(@PathVariable Long id) {
        try {
            Product product = productService.toggleAvailability(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    /**
     * GET /api/products/public/category/{categoria}
     * Busca productos por categoría
     */
    @GetMapping("/public/category/{categoria}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String categoria) {
        List<Product> products = productService.getProductsByCategory(categoria);
        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/products/public/search
     * Busca productos por nombre
     */
    @GetMapping("/public/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String q) {
        List<Product> products = productService.searchProductsByName(q);
        return ResponseEntity.ok(products);
    }

    // Clases internas para respuestas
    private static class ErrorResponse {
        private String message;
        public ErrorResponse(String message) { this.message = message; }
        @SuppressWarnings("unused")
        public String getMessage() { return message; }
    }

    private static class SuccessResponse {
        private String message;
        public SuccessResponse(String message) { this.message = message; }
        @SuppressWarnings("unused")
        public String getMessage() { return message; }
    }
}