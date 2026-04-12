package com.localshops.dto;

import com.localshops.model.Product;

import java.math.BigDecimal;

public record ProductSearchResultDto(
        Long id,
        String name,
        String description,
        BigDecimal price,
        boolean isAvailable,
        ShopSummaryDto shop
) {
    public static ProductSearchResultDto from(Product p) {
        return new ProductSearchResultDto(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.isAvailable(),
                ShopSummaryDto.from(p.getShop())
        );
    }
}
