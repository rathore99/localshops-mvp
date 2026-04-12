package com.localshops.controller;

import com.localshops.dto.ShopDetailDto;
import com.localshops.dto.ShopSummaryDto;
import com.localshops.service.ShopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Shops", description = "Public shop and category endpoints")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @GetMapping("/shops")
    @Operation(summary = "List all active shops")
    public ResponseEntity<List<ShopSummaryDto>> getShops() {
        return ResponseEntity.ok(shopService.getActiveShops());
    }

    @GetMapping("/shops/{id}")
    @Operation(summary = "Get shop details with product list")
    public ResponseEntity<ShopDetailDto> getShopById(@PathVariable Long id) {
        return ResponseEntity.ok(shopService.getShopById(id));
    }

    @GetMapping("/categories")
    @Operation(summary = "List distinct categories of active shops")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(shopService.getCategories());
    }
}
