package com.sih.fake_idenity_screening.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "screenings")
public class Screening {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String applicantName;

    private String documentType;

    private double ocrScore;

    private double faceMatch;

    private double tamperRisk;

    private boolean fraud;

    private String verdict;

    private LocalDateTime createdAt;

    public Screening() {
    }

    public Long getId() {
        return id;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public double getOcrScore() {
        return ocrScore;
    }

    public void setOcrScore(double ocrScore) {
        this.ocrScore = ocrScore;
    }

    public double getFaceMatch() {
        return faceMatch;
    }

    public void setFaceMatch(double faceMatch) {
        this.faceMatch = faceMatch;
    }

    public double getTamperRisk() {
        return tamperRisk;
    }

    public void setTamperRisk(double tamperRisk) {
        this.tamperRisk = tamperRisk;
    }

    public boolean isFraud() {
        return fraud;
    }

    public void setFraud(boolean fraud) {
        this.fraud = fraud;
    }

    public String getVerdict() {
        return verdict;
    }

    public void setVerdict(String verdict) {
        this.verdict = verdict;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}