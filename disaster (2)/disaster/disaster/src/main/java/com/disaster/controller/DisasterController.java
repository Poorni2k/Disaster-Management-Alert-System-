package com.disaster.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.disaster.entity.Disaster;
import com.disaster.repository.DisasterRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DisasterController {

    @Autowired
    private DisasterRepository disasterRepository;

    // Add Disaster
    @PostMapping("/disaster")
    public String addDisaster(@RequestBody Disaster disaster) {
        disasterRepository.save(disaster);
        return "Disaster Added Successfully";
    }

    // Get All Disasters
    @GetMapping("/disasters")
    public List<Disaster> getAllDisasters() {
        return disasterRepository.findAll();
    }
}