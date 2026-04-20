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
        String trimmed = query.trim();
        if (trimmed.isBlank()) {
            return List.of();
        }
        return productRepository.searchByName(trimmed).stream()
                .map(ProductSearchResultDto::from)
                .toList();
    }
}
