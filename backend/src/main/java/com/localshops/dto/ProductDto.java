package com.localshops.dto;

import com.localshops.model.Product;

import java.math.BigDecimal;

public record ProductDto(
        Long id,
        String name,
        String description,
        BigDecimal price,
        boolean isAvailable
) {
    public static ProductDto from(Product p) {
        return new ProductDto(p.getId(), p.getName(), p.getDescription(), p.getPrice(), p.isAvailable());
    }
}
