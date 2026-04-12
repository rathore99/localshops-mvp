package com.localshops.repository;

import com.localshops.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByShopId(Long shopId);

    // ILIKE search — works on H2 (dev) and PostgreSQL (prod).
    // Used now for Feature 1 dev-mode search.
    @Query("""
            SELECT p FROM Product p
            JOIN FETCH p.shop s
            WHERE s.isActive = true
              AND UPPER(p.name) LIKE UPPER(:pattern)
            ORDER BY p.name
            """)
    List<Product> searchByNameIlike(String pattern);

    // Full-text search — PostgreSQL only, wired in Feature 2.
    @Query(value = """
            SELECT p.* FROM products p
            JOIN shops s ON s.id = p.shop_id
            WHERE s.is_active = true
              AND to_tsvector('english', p.name) @@ plainto_tsquery('english', :query)
            ORDER BY p.name
            """, nativeQuery = true)
    List<Product> searchByName(String query);
}
