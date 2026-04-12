package com.localshops.service;

import com.localshops.dto.ShopDetailDto;
import com.localshops.dto.ShopSummaryDto;
import com.localshops.exception.ResourceNotFoundException;
import com.localshops.repository.ShopRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ShopService {

    private final ShopRepository shopRepository;

    public ShopService(ShopRepository shopRepository) {
        this.shopRepository = shopRepository;
    }

    public List<ShopSummaryDto> getActiveShops() {
        return shopRepository.findByIsActiveTrue().stream()
                .map(ShopSummaryDto::from)
                .toList();
    }

    public ShopDetailDto getShopById(Long id) {
        return shopRepository.findByIdAndIsActiveTrue(id)
                .map(ShopDetailDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found with id: " + id));
    }

    public List<String> getCategories() {
        return shopRepository.findDistinctCategoriesByIsActiveTrue();
    }
}
