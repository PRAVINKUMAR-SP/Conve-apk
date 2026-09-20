package com.convey.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing
public class MongoConfig {
    // MongoDB auditing enabled for @CreatedDate / @LastModifiedDate if needed later.
    // Connection is configured via application.yml spring.data.mongodb.uri
}
