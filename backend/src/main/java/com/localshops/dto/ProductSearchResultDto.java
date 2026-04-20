package com.localshops.dto;

import com.localshops.model.Product;

import java.math.BigDecimal;

public record ProductSearchResultDto(
        Long productId,
        String productName,
        String description,
        BigDecimal price,
        boolean isAvailable,
        Long shopId,
        String shopName,
        String shopCategory,
        String town
) {
    public static ProductSearchResultDto from(Product p) {
        return new ProductSearchResultDto(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.isAvailable(),
                p.getShop().getId(),
                p.getShop().getName(),
                p.getShop().getCategory(),
                p.getShop().getTown()
        );
    }
}
