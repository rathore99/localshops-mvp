package com.localshops.dto;

import com.localshops.model.Shop;

import java.util.List;

public record ShopDetailDto(
        Long id,
        String name,
        String category,
        String phone,
        String address,
        String town,
        String description,
        String imageUrl,
        List<ProductDto> products
) {
    public static ShopDetailDto from(Shop s) {
        List<ProductDto> products = s.getProducts().stream()
                .map(ProductDto::from)
                .toList();
        return new ShopDetailDto(
                s.getId(), s.getName(), s.getCategory(),
                s.getPhone(), s.getAddress(), s.getTown(),
                s.getDescription(), s.getImageUrl(), products
        );
    }
}
