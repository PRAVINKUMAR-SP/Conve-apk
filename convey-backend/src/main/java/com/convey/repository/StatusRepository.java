package com.convey.repository;

import com.convey.model.Status;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface StatusRepository extends MongoRepository<Status, String> {

    List<Status> findByUserId(String userId);

    List<Status> findByUserIdInAndExpiresAtAfter(List<String> userIds, Instant now);
}
