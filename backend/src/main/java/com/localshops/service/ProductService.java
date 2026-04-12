package com.localshops.service;

import com.localshops.dto.ProductSearchResultDto;
import com.localshops.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductSearchResultDto> search(String query) {
        // Uses ILIKE on H2 (dev), full-text search on PostgreSQL (prod).
        // Full-text search with to_tsvector is wired in Feature 2.
        return productRepository.searchByNameIlike("%" + query + "%")
                .stream()
                .map(ProductSearchResultDto::from)
                .toList();
    }
}
