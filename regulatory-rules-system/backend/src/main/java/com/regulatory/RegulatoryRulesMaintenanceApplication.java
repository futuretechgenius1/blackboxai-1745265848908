package com.regulatory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class RegulatoryRulesMaintenanceApplication {
    public static void main(String[] args) {
        SpringApplication.run(RegulatoryRulesMaintenanceApplication.class, args);
    }
}
