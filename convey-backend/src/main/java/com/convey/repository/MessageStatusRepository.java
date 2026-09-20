package com.convey.repository;

import com.convey.model.MessageStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageStatusRepository extends MongoRepository<MessageStatus, String> {

    List<MessageStatus> findByMessageId(String messageId);

    Optional<MessageStatus> findByMessageIdAndUserId(String messageId, String userId);
}
