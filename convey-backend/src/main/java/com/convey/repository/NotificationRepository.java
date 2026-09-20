package com.convey.repository;

import com.convey.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByUserIdAndReadFalse(String userId);

    List<Notification> findByUserId(String userId);

    long countByUserIdAndReadFalse(String userId);
}
