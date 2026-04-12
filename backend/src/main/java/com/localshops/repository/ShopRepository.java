package com.localshops.repository;

import com.localshops.model.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ShopRepository extends JpaRepository<Shop, Long> {

    List<Shop> findByIsActiveTrue();

    Optional<Shop> findByIdAndIsActiveTrue(Long id);

    @Query("SELECT DISTINCT s.category FROM Shop s WHERE s.isActive = true ORDER BY s.category")
    List<String> findDistinctCategoriesByIsActiveTrue();
}
