package com.sih.fake_idenity_screening.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sih.fake_idenity_screening.entity.Screening;
import com.sih.fake_idenity_screening.repository.ScreeningRepository;

@Service
public class ScreeningService {

    private final ScreeningRepository screeningRepository;

  private final OcrService ocrService;

public ScreeningService(
        ScreeningRepository screeningRepository,
        OcrService ocrService) {

    this.screeningRepository = screeningRepository;
    this.ocrService = ocrService;
}

    public Screening analyzeAndSave(
            Screening screening,
            MultipartFile document,
            MultipartFile selfie) {

        // 1. Validate uploaded files
        if (document == null || document.isEmpty()) {
            throw new RuntimeException("Identity document is missing");
        }

        if (selfie == null || selfie.isEmpty()) {
            throw new RuntimeException("Selfie is missing");
        }

        // 2. Basic file validation
        if (!isImage(document)) {
            throw new RuntimeException("Identity document must be an image");
        }

        if (!isImage(selfie)) {
            throw new RuntimeException("Selfie must be an image");
        }

        // 3. Calculate scores from actual uploaded files
       String extractedText = ocrService.extractText(document);

System.out.println("========== OCR TEXT ==========");
System.out.println(extractedText);
System.out.println("==============================");

double ocrScore = calculateOcrScore(extractedText);
        double faceMatch = calculateFaceMatch(document, selfie);
        double tamperRisk = calculateTamperRisk(document);

        // 4. Determine fraud
        boolean fraud = tamperRisk >= 70 || faceMatch < 50 || ocrScore < 60;

        // 5. Store calculated results
        screening.setOcrScore(ocrScore);
        screening.setFaceMatch(faceMatch);
        screening.setTamperRisk(tamperRisk);
        screening.setFraud(fraud);

        if (fraud) {
            screening.setVerdict(
                "CRITICAL ALERT: Potential Identity Fraud Detected"
            );
        } else {
            screening.setVerdict(
                "AUTHENTICATION PASSED: Identity Verification Checks Completed"
            );
        }

        screening.setCreatedAt(LocalDateTime.now());

        return screeningRepository.save(screening);
    }

    private boolean isImage(MultipartFile file) {
        String contentType = file.getContentType();

        return contentType != null &&
                (contentType.equals("image/jpeg") ||
                 contentType.equals("image/png") ||
                 contentType.equals("image/webp"));
    }

    private double calculateDocumentScore(MultipartFile document) {

        long size = document.getSize();

        // Very small images are suspicious/low quality
        if (size < 20_000) {
            return 45.0;
        }

        // Extremely large images can indicate unnecessary manipulation
        if (size > 10_000_000) {
            return 75.0;
        }

        // Normal image size
        return 95.0;
    }

    private double calculateFaceMatch(
            MultipartFile document,
            MultipartFile selfie) {

        // Basic prototype:
        // We verify that both images exist and have usable sizes.
        // This is NOT real facial recognition yet.

        if (document.getSize() < 20_000 || selfie.getSize() < 20_000) {
            return 40.0;
        }

        return 92.0;
    }

    private double calculateTamperRisk(MultipartFile document) {

        long size = document.getSize();

        // Prototype rule-based tamper detection
        if (size < 20_000) {
            return 80.0;
        }

        if (size > 10_000_000) {
            return 55.0;
        }

        return 5.0;
    }

    public List<Screening> getAllScreenings() {
        return screeningRepository.findAll();
    }
    private double calculateOcrScore(String extractedText) {

    if (extractedText == null || extractedText.trim().isEmpty()) {
        return 20.0;
    }

    int textLength = extractedText.trim().length();

    if (textLength < 20) {
        return 45.0;
    }

    if (textLength < 50) {
        return 70.0;
    }

    return 95.0;
}
}