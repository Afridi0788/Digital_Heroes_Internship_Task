package com.pagepulse.repository;

import com.pagepulse.entity.AuditHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for AuditHistory entity operations.
 */
@Repository
public interface AuditHistoryRepository extends JpaRepository<AuditHistory, Long> {

    /**
     * Find the most recent audit history entries.
     *
     * @return List of recent audit history records ordered by creation date descending
     */
    List<AuditHistory> findTop10ByOrderByCreatedAtDesc();

    /**
     * Find audit history by URL.
     *
     * @param url The URL to search for
     * @return List of audit history records for the given URL
     */
    List<AuditHistory> findByUrlOrderByCreatedAtDesc(String url);

}
