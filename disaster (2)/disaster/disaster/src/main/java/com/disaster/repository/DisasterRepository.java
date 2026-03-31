package com.disaster.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.disaster.entity.Disaster;

public interface DisasterRepository extends JpaRepository<Disaster, Long> {

} 