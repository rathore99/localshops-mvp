package com.localshops.service;

import com.localshops.dto.ProductSearchResultDto;
import com.localshops.model.Product;
import com.localshops.model.Shop;
import com.localshops.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Shop shop;
    private Product availableProduct;
    private Product unavailableProduct;

    @BeforeEach
    void setUp() {
        shop = new Shop();
        shop.setId(1L);
        shop.setName("Shri Fashion");
        shop.setCategory("Apparel");
        shop.setPhone("9876543210");
        shop.setAddress("Main Road");
        shop.setTown("Singrauli");
        shop.setActive(true);

        availableProduct = new Product();
        availableProduct.setId(1L);
        availableProduct.setName("Blue Cotton Shirt");
        availableProduct.setDescription("Men's regular fit");
        availableProduct.setPrice(new BigDecimal("599.00"));
        availableProduct.setAvailable(true);
        availableProduct.setShop(shop);

        unavailableProduct = new Product();
        unavailableProduct.setId(2L);
        unavailableProduct.setName("Red Saree");
        unavailableProduct.setDescription("Silk saree");
        unavailableProduct.setPrice(new BigDecimal("1200.00"));
        unavailableProduct.setAvailable(false);
        unavailableProduct.setShop(shop);
    }

    // --- search ---

    @Test
    @DisplayName("search returns matching products as DTOs")
    void search_returnsMatchingProducts() {
        when(productRepository.searchByName("shirt")).thenReturn(List.of(availableProduct));

        List<ProductSearchResultDto> result = productService.search("shirt");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).productName()).isEqualTo("Blue Cotton Shirt");
        verify(productRepository).searchByName("shirt");
    }

    @Test
    @DisplayName("search returns empty list when no match")
    void search_returnsEmptyListWhenNoMatch() {
        when(productRepository.searchByName("xyz")).thenReturn(List.of());

        List<ProductSearchResultDto> result = productService.search("xyz");

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("search maps all required DTO fields")
    void search_mapsAllDtoFields() {
        when(productRepository.searchByName("shirt")).thenReturn(List.of(availableProduct));

        ProductSearchResultDto dto = productService.search("shirt").get(0);

        assertThat(dto.productId()).isEqualTo(1L);
        assertThat(dto.productName()).isEqualTo("Blue Cotton Shirt");
        assertThat(dto.price()).isEqualByComparingTo(new BigDecimal("599.00"));
        assertThat(dto.isAvailable()).isTrue();
        assertThat(dto.shopId()).isEqualTo(1L);
        assertThat(dto.shopName()).isEqualTo("Shri Fashion");
        assertThat(dto.shopCategory()).isEqualTo("Apparel");
        assertThat(dto.town()).isEqualTo("Singrauli");
    }

    @Test
    @DisplayName("search includes unavailable products in results")
    void search_includesUnavailableProducts() {
        when(productRepository.searchByName("saree")).thenReturn(List.of(unavailableProduct));

        List<ProductSearchResultDto> result = productService.search("saree");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).isAvailable()).isFalse();
    }

    @Test
    @DisplayName("search returns results from multiple shops")
    void search_returnsResultsAcrossShops() {
        Shop shop2 = new Shop();
        shop2.setId(2L);
        shop2.setName("Bharat Kirana");
        shop2.setCategory("Groceries");
        shop2.setPhone("9812345678");
        shop2.setAddress("Nehru Nagar");
        shop2.setTown("Singrauli");
        shop2.setActive(true);

        Product groceryProduct = new Product();
        groceryProduct.setId(3L);
        groceryProduct.setName("Salt Pack");
        groceryProduct.setPrice(new BigDecimal("20.00"));
        groceryProduct.setAvailable(true);
        groceryProduct.setShop(shop2);

        when(productRepository.searchByName("a")).thenReturn(List.of(availableProduct, groceryProduct));

        List<ProductSearchResultDto> result = productService.search("a");

        assertThat(result).hasSize(2);
        assertThat(result.stream().map(ProductSearchResultDto::shopId))
                .containsExactlyInAnyOrder(1L, 2L);
    }

    @Test
    @DisplayName("search trims whitespace from query before passing to repository")
    void search_trimsQueryBeforeRepository() {
        when(productRepository.searchByName("shirt")).thenReturn(List.of(availableProduct));

        productService.search("  shirt  ");

        verify(productRepository).searchByName("shirt");
    }

    @Test
    @DisplayName("search with blank query returns empty list without hitting repository")
    void search_blankQueryReturnsEmpty() {
        List<ProductSearchResultDto> result = productService.search("   ");

        assertThat(result).isEmpty();
        verifyNoInteractions(productRepository);
    }
}
