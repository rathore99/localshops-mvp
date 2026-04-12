package com.localshops.controller;

import com.localshops.dto.ProductSearchResultDto;
import com.localshops.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Products", description = "Product search endpoints")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by keyword across all active shops")
    public ResponseEntity<List<ProductSearchResultDto>> search(@RequestParam String q) {
        if (q == null || q.isBlank()) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(productService.search(q.trim()));
    }
}
