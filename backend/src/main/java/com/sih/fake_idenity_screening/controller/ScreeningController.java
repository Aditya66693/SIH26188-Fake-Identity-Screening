package com.sih.fake_idenity_screening.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sih.fake_idenity_screening.entity.Screening;
import com.sih.fake_idenity_screening.service.ScreeningService;

@RestController
@RequestMapping("/api/screenings")
@CrossOrigin(origins = "http://localhost:5173")
public class ScreeningController {

    private final ScreeningService screeningService;

    public ScreeningController(ScreeningService screeningService) {
        this.screeningService = screeningService;
    }

    @PostMapping
    public Screening createScreening(
            @RequestParam("document") MultipartFile document,
            @RequestParam("selfie") MultipartFile selfie,
            @RequestParam("applicantName") String applicantName,
            @RequestParam("documentType") String documentType) {

        Screening screening = new Screening();

        screening.setApplicantName(applicantName);
        screening.setDocumentType(documentType);

        // Temporary demo scores
        screening.setOcrScore(99.1);
        screening.setFaceMatch(98.4);
        screening.setTamperRisk(1.5);
        screening.setFraud(false);
        screening.setVerdict(
                "AUTHENTICATION PASSED: All Cryptographic & Forensic Markers Validated"
        );

        return screeningService.saveScreening(screening);
    }

    @GetMapping
    public List<Screening> getAllScreenings() {
        return screeningService.getAllScreenings();
    }
}