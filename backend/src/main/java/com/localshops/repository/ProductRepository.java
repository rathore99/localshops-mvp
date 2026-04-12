package com.localshops.repository;

import com.localshops.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByShopId(Long shopId);

    // Full-text search across product names — used in Feature 2
    @Query(value = """
            SELECT p.* FROM products p
            JOIN shops s ON s.id = p.shop_id
            WHERE s.is_active = true
              AND to_tsvector('english', p.name) @@ plainto_tsquery('english', :query)
            ORDER BY p.name
            """, nativeQuery = true)
    List<Product> searchByName(String query);
}
