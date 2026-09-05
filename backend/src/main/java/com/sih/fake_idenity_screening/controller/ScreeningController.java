
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
import com.sih.fake_idenity_screening.service.OcrService;
import com.sih.fake_idenity_screening.service.ScreeningService;

@RestController
@RequestMapping("/api/screenings")
@CrossOrigin(origins = "http://localhost:5173")
public class ScreeningController {

   private final ScreeningService screeningService;
private final OcrService ocrService;

public ScreeningController(
        ScreeningService screeningService,
        OcrService ocrService) {

    this.screeningService = screeningService;
    this.ocrService = ocrService;
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

        return screeningService.analyzeAndSave(
                screening,
                document,
                selfie
        );
    }

    @GetMapping
    public List<Screening> getAllScreenings() {
        return screeningService.getAllScreenings();
    }
}