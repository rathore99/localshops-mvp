package com.localshops.repository;

import com.localshops.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByShopId(Long shopId);

    // JPQL LOWER/LIKE — compatible with both H2 (dev) and PostgreSQL (prod).
    // Only returns products from active shops.
    // Feature 3 note: POST /api/v1/reservations will need product existence check here.
    @Query("SELECT p FROM Product p JOIN p.shop s " +
           "WHERE s.isActive = true " +
           "AND LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchByName(@Param("query") String query);
}
