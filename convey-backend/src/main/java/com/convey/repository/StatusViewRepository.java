package com.convey.repository;

import com.convey.model.StatusView;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusViewRepository extends MongoRepository<StatusView, String> {

    List<StatusView> findByStatusId(String statusId);

    boolean existsByStatusIdAndViewerId(String statusId, String viewerId);
}
