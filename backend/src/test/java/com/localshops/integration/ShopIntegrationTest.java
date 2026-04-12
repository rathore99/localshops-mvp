package com.localshops.integration;

import com.localshops.model.Product;
import com.localshops.model.Shop;
import com.localshops.repository.ProductRepository;
import com.localshops.repository.ShopRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
@Transactional
class ShopIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("localshops_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        // Only run schema migrations, no seed data in tests
        registry.add("spring.flyway.locations", () -> "classpath:db/migration");
    }

    @Autowired MockMvc mockMvc;
    @Autowired ShopRepository shopRepository;
    @Autowired ProductRepository productRepository;

    private Shop activeShop;
    private Shop inactiveShop;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        shopRepository.deleteAll();

        activeShop = new Shop();
        activeShop.setName("Shri Fashion");
        activeShop.setCategory("Apparel");
        activeShop.setPhone("9876543210");
        activeShop.setAddress("Main Road, Singrauli");
        activeShop.setTown("Singrauli");
        activeShop.setActive(true);
        activeShop = shopRepository.save(activeShop);

        inactiveShop = new Shop();
        inactiveShop.setName("Closed Store");
        inactiveShop.setCategory("Groceries");
        inactiveShop.setPhone("9000000000");
        inactiveShop.setAddress("Side Street");
        inactiveShop.setTown("Singrauli");
        inactiveShop.setActive(false);
        inactiveShop = shopRepository.save(inactiveShop);

        Product p1 = new Product();
        p1.setName("Blue Shirt");
        p1.setPrice(new BigDecimal("599.00"));
        p1.setAvailable(true);
        p1.setShop(activeShop);
        productRepository.save(p1);

        Product p2 = new Product();
        p2.setName("Black Jeans");
        p2.setPrice(new BigDecimal("899.00"));
        p2.setAvailable(false);
        p2.setShop(activeShop);
        productRepository.save(p2);
    }

    // --- GET /api/v1/shops ---

    @Test
    @DisplayName("GET /api/v1/shops returns 200 with only active shops")
    void getShops_returns200WithActiveShopsOnly() throws Exception {
        mockMvc.perform(get("/api/v1/shops").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("Shri Fashion")))
                .andExpect(jsonPath("$[0].category", is("Apparel")))
                .andExpect(jsonPath("$[0].phone", is("9876543210")));
    }

    @Test
    @DisplayName("GET /api/v1/shops does not expose inactive shops")
    void getShops_doesNotExposeInactiveShops() throws Exception {
        mockMvc.perform(get("/api/v1/shops").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].name", not(hasItem("Closed Store"))));
    }

    @Test
    @DisplayName("GET /api/v1/shops returns empty array when no active shops")
    void getShops_returnsEmptyArrayWhenNone() throws Exception {
        shopRepository.deleteAll();

        mockMvc.perform(get("/api/v1/shops").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    // --- GET /api/v1/shops/{id} ---

    @Test
    @DisplayName("GET /api/v1/shops/{id} returns shop with products")
    void getShopById_returnsShopWithProducts() throws Exception {
        mockMvc.perform(get("/api/v1/shops/{id}", activeShop.getId()).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(activeShop.getId().intValue())))
                .andExpect(jsonPath("$.name", is("Shri Fashion")))
                .andExpect(jsonPath("$.products", hasSize(2)));
    }

    @Test
    @DisplayName("GET /api/v1/shops/{id} includes both available and unavailable products")
    void getShopById_includesAllProducts() throws Exception {
        mockMvc.perform(get("/api/v1/shops/{id}", activeShop.getId()).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.products[*].name", hasItems("Blue Shirt", "Black Jeans")));
    }

    @Test
    @DisplayName("GET /api/v1/shops/{id} returns 404 for unknown id")
    void getShopById_returns404ForUnknownId() throws Exception {
        mockMvc.perform(get("/api/v1/shops/9999").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/v1/shops/{id} returns 404 for inactive shop")
    void getShopById_returns404ForInactiveShop() throws Exception {
        mockMvc.perform(get("/api/v1/shops/{id}", inactiveShop.getId()).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/v1/shops/abc returns 400 for non-numeric id")
    void getShopById_returns400ForNonNumericId() throws Exception {
        mockMvc.perform(get("/api/v1/shops/abc").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    // --- GET /api/v1/categories ---

    @Test
    @DisplayName("GET /api/v1/categories returns distinct categories of active shops")
    void getCategories_returnsDistinctCategories() throws Exception {
        // Add another active shop in same category to verify distinct
        Shop anotherApparel = new Shop();
        anotherApparel.setName("Fashion Hub");
        anotherApparel.setCategory("Apparel");
        anotherApparel.setPhone("9111111111");
        anotherApparel.setAddress("Market Road");
        anotherApparel.setTown("Singrauli");
        anotherApparel.setActive(true);
        shopRepository.save(anotherApparel);

        mockMvc.perform(get("/api/v1/categories").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0]", is("Apparel")));
    }

    @Test
    @DisplayName("GET /api/v1/categories does not include categories of inactive shops")
    void getCategories_excludesInactiveShopCategories() throws Exception {
        mockMvc.perform(get("/api/v1/categories").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*]", not(hasItem("Groceries"))));
    }

    // --- GET /api/v1/health ---

    @Test
    @DisplayName("GET /api/v1/health returns 200 UP")
    void healthCheck_returns200() throws Exception {
        mockMvc.perform(get("/api/v1/health").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")));
    }
}
