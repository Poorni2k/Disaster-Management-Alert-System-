package com.disaster.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.disaster.entity.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {
}