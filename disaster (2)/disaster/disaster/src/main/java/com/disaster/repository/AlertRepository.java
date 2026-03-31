package com.disaster.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.disaster.entity.Alert;

public interface AlertRepository extends JpaRepository<Alert, Long> {
}