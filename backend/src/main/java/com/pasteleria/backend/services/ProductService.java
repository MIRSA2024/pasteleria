package com.pasteleria.backend.services;

import com.pasteleria.backend.models.Product;
import com.pasteleria.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio de productos
 * Maneja la lógica de negocio relacionada con el catálogo de productos
 */
@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    /**
     * Obtiene todos los productos
     */
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /**
     * Obtiene solo productos disponibles
     */
    public List<Product> getAvailableProducts() {
        return productRepository.findByDisponibleTrue();
    }

    /**
     * Obtiene un producto por ID
     */
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
    }

    /**
     * Crea un nuevo producto (Solo ADMIN)
     */
    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    /**
     * Actualiza un producto existente (Solo ADMIN)
     */
    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);

        product.setNombre(productDetails.getNombre());
        product.setDescripcion(productDetails.getDescripcion());
        product.setPrecio(productDetails.getPrecio());
        product.setImagenUrl(productDetails.getImagenUrl());
        product.setCategoria(productDetails.getCategoria());
        product.setDisponible(productDetails.getDisponible());

        return productRepository.save(product);
    }

    /**
     * Elimina un producto (Solo ADMIN)
     */
    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    /**
     * Busca productos por categoría
     */
    public List<Product> getProductsByCategory(String categoria) {
        return productRepository.findByCategoriaAndDisponibleTrue(categoria);
    }

    /**
     * Busca productos por nombre
     */
    public List<Product> searchProductsByName(String nombre) {
        return productRepository.findByNombreContainingIgnoreCase(nombre);
    }

    /**
     * Cambia la disponibilidad de un producto
     */
    @Transactional
    public Product toggleAvailability(Long id) {
        Product product = getProductById(id);
        product.setDisponible(!product.getDisponible());
        return productRepository.save(product);
    }
}