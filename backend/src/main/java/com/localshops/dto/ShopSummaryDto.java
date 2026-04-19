package com.localshops.dto;

import com.localshops.model.Shop;

public record ShopSummaryDto(
        Long id,
        String name,
        String category,
        String phone,
        String address,
        String town,
        String description,
        String imageUrl
) {
    public static ShopSummaryDto from(Shop s) {
        return new ShopSummaryDto(
                s.getId(), s.getName(), s.getCategory(),
                s.getPhone(), s.getAddress(), s.getTown(),
                s.getDescription(), s.getImageUrl()
        );
    }
}
