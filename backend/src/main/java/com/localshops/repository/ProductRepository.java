package com.localshops.repository;

import com.localshops.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByShopId(Long shopId);

    // NOTE: Full-text search query lives in Feature 2 (ProductService.search).
    // Not implemented here yet — Feature 2 branch will add it.
}
