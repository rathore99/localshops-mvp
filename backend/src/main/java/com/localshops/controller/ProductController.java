package com.localshops.controller;

import com.localshops.dto.ProductSearchResultDto;
import com.localshops.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // GET /api/v1/products/search?q=<query>
    // Returns products from active shops whose name contains the query (case-insensitive).
    // Returns 400 if q param is missing (Spring default).
    // Returns empty array if q is blank or no matches.
    @GetMapping("/search")
    public List<ProductSearchResultDto> search(@RequestParam String q) {
        return productService.search(q);
    }
}
