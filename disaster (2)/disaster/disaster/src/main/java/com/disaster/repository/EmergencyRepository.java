package com.disaster.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.disaster.entity.EmergencyRequest;

public interface EmergencyRepository extends JpaRepository<EmergencyRequest, Long> {
}