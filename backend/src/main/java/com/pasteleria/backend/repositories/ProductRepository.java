package com.pasteleria.backend.repositories;

import com.pasteleria.backend.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Product
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Busca productos disponibles
     */
    List<Product> findByDisponibleTrue();

    /**
     * Busca productos por categoría
     */
    List<Product> findByCategoria(String categoria);

    /**
     * Busca productos disponibles por categoría
     */
    List<Product> findByCategoriaAndDisponibleTrue(String categoria);

    /**
     * Busca productos por nombre (búsqueda parcial)
     */
    List<Product> findByNombreContainingIgnoreCase(String nombre);
}