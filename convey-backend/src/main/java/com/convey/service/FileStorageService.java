package com.convey.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    @Value("${aws.s3.bucket-name:}")
    private String bucketName;

    @Value("${aws.region:}")
    private String awsRegion;

    @Value("${aws.access-key:}")
    private String awsAccessKey;

    @Value("${aws.secret-key:}")
    private String awsSecretKey;

    private S3Client s3Client;
    private Path localUploadDir;
    private boolean useS3 = false;

    @PostConstruct
    public void init() {
        if (awsAccessKey != null && !awsAccessKey.isEmpty() && awsSecretKey != null && !awsSecretKey.isEmpty() && bucketName != null && !bucketName.isEmpty()) {
            try {
                this.s3Client = S3Client.builder()
                        .region(Region.of(awsRegion))
                        .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(awsAccessKey, awsSecretKey)))
                        .build();
                this.useS3 = true;
                log.info("Initialized Amazon S3 for file storage in region {}", awsRegion);
            } catch (Exception e) {
                log.error("Failed to initialize Amazon S3, falling back to local storage", e);
            }
        }

        if (!this.useS3) {
            this.localUploadDir = Paths.get("uploads").toAbsolutePath().normalize();
            try {
                Files.createDirectories(this.localUploadDir);
                log.info("Using local file storage at {}", this.localUploadDir);
            } catch (IOException e) {
                throw new RuntimeException("Could not create local upload directory", e);
            }
        }
    }

    public String storeFile(MultipartFile file) {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        if (useS3) {
            try {
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileName)
                        .contentType(file.getContentType())
                        .build();
                s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
                return "https://" + bucketName + ".s3." + awsRegion + ".amazonaws.com/" + fileName;
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload file to S3", e);
            }
        } else {
            try {
                Path targetPath = this.localUploadDir.resolve(fileName);
                Files.copy(file.getInputStream(), targetPath);
                return "/uploads/" + fileName;
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file locally", e);
            }
        }
    }
}
