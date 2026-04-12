package com.localshops.service;

import com.localshops.dto.ShopDetailDto;
import com.localshops.dto.ShopSummaryDto;
import com.localshops.exception.ResourceNotFoundException;
import com.localshops.model.Product;
import com.localshops.model.Shop;
import com.localshops.repository.ShopRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShopServiceTest {

    @Mock
    private ShopRepository shopRepository;

    @InjectMocks
    private ShopService shopService;

    private Shop activeShop;
    private Shop inactiveShop;
    private Product availableProduct;
    private Product unavailableProduct;

    @BeforeEach
    void setUp() {
        activeShop = new Shop();
        activeShop.setId(1L);
        activeShop.setName("Shri Fashion");
        activeShop.setCategory("Apparel");
        activeShop.setPhone("9876543210");
        activeShop.setAddress("Main Road, Singrauli");
        activeShop.setTown("Singrauli");
        activeShop.setActive(true);

        inactiveShop = new Shop();
        inactiveShop.setId(2L);
        inactiveShop.setName("Closed Store");
        inactiveShop.setCategory("Groceries");
        inactiveShop.setPhone("9000000000");
        inactiveShop.setAddress("Side Street");
        inactiveShop.setTown("Singrauli");
        inactiveShop.setActive(false);

        availableProduct = new Product();
        availableProduct.setId(1L);
        availableProduct.setName("Blue Shirt");
        availableProduct.setPrice(new BigDecimal("599.00"));
        availableProduct.setAvailable(true);
        availableProduct.setShop(activeShop);

        unavailableProduct = new Product();
        unavailableProduct.setId(2L);
        unavailableProduct.setName("Black Jeans");
        unavailableProduct.setPrice(new BigDecimal("899.00"));
        unavailableProduct.setAvailable(false);
        unavailableProduct.setShop(activeShop);

        activeShop.setProducts(List.of(availableProduct, unavailableProduct));
    }

    // --- getActiveShops ---

    @Test
    @DisplayName("getActiveShops returns only active shops")
    void getActiveShops_returnsOnlyActiveShops() {
        when(shopRepository.findByIsActiveTrue()).thenReturn(List.of(activeShop));

        List<ShopSummaryDto> result = shopService.getActiveShops();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).name()).isEqualTo("Shri Fashion");
        assertThat(result.get(0).category()).isEqualTo("Apparel");
        verify(shopRepository).findByIsActiveTrue();
    }

    @Test
    @DisplayName("getActiveShops returns empty list when no active shops")
    void getActiveShops_returnsEmptyListWhenNone() {
        when(shopRepository.findByIsActiveTrue()).thenReturn(List.of());

        List<ShopSummaryDto> result = shopService.getActiveShops();

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("getActiveShops maps all required fields to DTO")
    void getActiveShops_mapsAllFieldsCorrectly() {
        when(shopRepository.findByIsActiveTrue()).thenReturn(List.of(activeShop));

        ShopSummaryDto dto = shopService.getActiveShops().get(0);

        assertThat(dto.id()).isEqualTo(1L);
        assertThat(dto.name()).isEqualTo("Shri Fashion");
        assertThat(dto.category()).isEqualTo("Apparel");
        assertThat(dto.phone()).isEqualTo("9876543210");
        assertThat(dto.address()).isEqualTo("Main Road, Singrauli");
        assertThat(dto.town()).isEqualTo("Singrauli");
    }

    // --- getShopById ---

    @Test
    @DisplayName("getShopById returns shop with all products including unavailable")
    void getShopById_returnsShopWithAllProducts() {
        when(shopRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(activeShop));

        ShopDetailDto result = shopService.getShopById(1L);

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("Shri Fashion");
        assertThat(result.products()).hasSize(2);
    }

    @Test
    @DisplayName("getShopById includes both available and unavailable products")
    void getShopById_includesBothAvailableAndUnavailableProducts() {
        when(shopRepository.findByIdAndIsActiveTrue(1L)).thenReturn(Optional.of(activeShop));

        ShopDetailDto result = shopService.getShopById(1L);

        boolean hasAvailable = result.products().stream().anyMatch(p -> p.isAvailable());
        boolean hasUnavailable = result.products().stream().anyMatch(p -> !p.isAvailable());
        assertThat(hasAvailable).isTrue();
        assertThat(hasUnavailable).isTrue();
    }

    @Test
    @DisplayName("getShopById throws ResourceNotFoundException for unknown id")
    void getShopById_throwsForUnknownId() {
        when(shopRepository.findByIdAndIsActiveTrue(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> shopService.getShopById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Shop not found");
    }

    @Test
    @DisplayName("getShopById throws ResourceNotFoundException for inactive shop")
    void getShopById_throwsForInactiveShop() {
        when(shopRepository.findByIdAndIsActiveTrue(2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> shopService.getShopById(2L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // --- getCategories ---

    @Test
    @DisplayName("getCategories returns distinct categories from active shops")
    void getCategories_returnsDistinctCategories() {
        when(shopRepository.findDistinctCategoriesByIsActiveTrue())
                .thenReturn(List.of("Apparel", "Groceries", "Electronics"));

        List<String> result = shopService.getCategories();

        assertThat(result).hasSize(3);
        assertThat(result).containsExactlyInAnyOrder("Apparel", "Groceries", "Electronics");
    }

    @Test
    @DisplayName("getCategories returns empty list when no active shops")
    void getCategories_returnsEmptyListWhenNoActiveShops() {
        when(shopRepository.findDistinctCategoriesByIsActiveTrue()).thenReturn(List.of());

        List<String> result = shopService.getCategories();

        assertThat(result).isEmpty();
    }
}
