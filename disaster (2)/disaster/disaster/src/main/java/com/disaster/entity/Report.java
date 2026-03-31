package com.disaster.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String title;
    private String message;
    private String district;
    private String severity;   // LOW / MEDIUM / HIGH

    public Report() {
    }

    public Report(String username, String title, String message, String district, String severity) {
        this.username = username;
        this.title = title;
        this.message = message;
        this.district = district;
        this.severity = severity;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public String getDistrict() {
        return district;
    }

    public String getSeverity() {
        return severity;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }
}