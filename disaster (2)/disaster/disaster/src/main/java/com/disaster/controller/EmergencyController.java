package com.disaster.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.disaster.entity.EmergencyRequest;
import com.disaster.repository.EmergencyRepository;

@RestController
@RequestMapping("/api/emergency")
@CrossOrigin(origins = "*")
public class EmergencyController {

    @Autowired
    private EmergencyRepository emergencyRepository;

    @PostMapping("/request")
    public String createRequest(@RequestBody EmergencyRequest request) {
        request.setStatus("PENDING");
        emergencyRepository.save(request);
        return "Emergency Request Submitted";
    }

    @GetMapping
    public List<EmergencyRequest> getAllRequests() {
        return emergencyRepository.findAll();
    }

    @PutMapping("/accept/{id}")
    public String acceptRequest(@PathVariable Long id) {

        EmergencyRequest req = emergencyRepository.findById(id).orElse(null);

        if(req != null){
            req.setStatus("ACCEPTED");
            emergencyRepository.save(req);
            return "Request Accepted";
        }

        return "Request Not Found";
    }

    @PutMapping("/resolve/{id}")
    public String resolveRequest(@PathVariable Long id) {

        EmergencyRequest req = emergencyRepository.findById(id).orElse(null);

        if(req != null){
            req.setStatus("RESOLVED");
            emergencyRepository.save(req);
            return "Request Resolved";
        }

        return "Request Not Found";
}
    
}