package com.sih.fake_idenity_screening.service;

import java.awt.image.BufferedImage;
import java.io.InputStream;

import javax.imageio.ImageIO;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import net.sourceforge.tess4j.Tesseract;

@Service
public class OcrService {

    public String extractText(MultipartFile document) {

        try {
            if (document == null || document.isEmpty()) {
                throw new RuntimeException("Document is empty");
            }

            InputStream inputStream = document.getInputStream();

            BufferedImage image = ImageIO.read(inputStream);

            if (image == null) {
                throw new RuntimeException(
                    "Uploaded file is not a valid image"
                );
            }

            Tesseract tesseract = new Tesseract();

            // Tesseract tessdata folder
            tesseract.setDatapath(
                "C:\\Program Files\\Tesseract-OCR\\tessdata"
            );

            // English language
            tesseract.setLanguage("eng");

            String extractedText = tesseract.doOCR(image);

            System.out.println("========== OCR TEXT ==========");
            System.out.println(extractedText);
            System.out.println("==============================");

            return extractedText;

        } catch (Exception e) {
            throw new RuntimeException("OCR processing failed", e);
        }
    }
}