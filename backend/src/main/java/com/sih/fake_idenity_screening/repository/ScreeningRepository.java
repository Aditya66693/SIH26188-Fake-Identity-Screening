package com.sih.fake_idenity_screening.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sih.fake_idenity_screening.entity.Screening;

public interface ScreeningRepository extends JpaRepository<Screening, Long> {
}