package com.sih.fake_idenity_screening.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.sih.fake_idenity_screening.entity.Screening;
import com.sih.fake_idenity_screening.repository.ScreeningRepository;

@Service
public class ScreeningService {

    private final ScreeningRepository screeningRepository;

    public ScreeningService(ScreeningRepository screeningRepository) {
        this.screeningRepository = screeningRepository;
    }

    public Screening saveScreening(Screening screening) {
        screening.setCreatedAt(LocalDateTime.now());
        return screeningRepository.save(screening);
    }

    public List<Screening> getAllScreenings() {
        return screeningRepository.findAll();
    }
}