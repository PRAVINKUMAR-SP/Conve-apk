package com.convey.repository;

import com.convey.model.Call;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CallRepository extends MongoRepository<Call, String> {

    List<Call> findByCallerIdOrReceiverIdOrderByCreatedAtDesc(String callerId, String receiverId);
}
