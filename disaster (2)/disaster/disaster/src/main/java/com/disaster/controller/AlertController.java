package com.disaster.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.disaster.entity.Alert;
import com.disaster.repository.AlertRepository;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    @Autowired
    private AlertRepository alertRepository;

    // Admin broadcast
    @PostMapping("/broadcast")
    public String broadcast(@RequestBody Alert alert) {
        alert.setTime(LocalDateTime.now());
        alertRepository.save(alert);
        return "Alert sent Successfully";
    }

    // Citizens view alerts
    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertRepository.findAll();
    }

    @PostMapping("/acknowledge/{id}")
    public String acknowledge(@PathVariable Long id) {
        return "Responder acknowledged alert ID: " + id;
    }

    @DeleteMapping("/{id}")
    public String deleteAlert(@PathVariable Long id) {

        alertRepository.deleteById(id);

        return "Alert Deleted Successfully";
    }
}