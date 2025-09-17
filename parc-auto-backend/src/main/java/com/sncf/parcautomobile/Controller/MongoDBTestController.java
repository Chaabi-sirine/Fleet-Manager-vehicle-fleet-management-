package com.sncf.parcautomobile.Controllers;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MongoDBTestController {

    private final MongoTemplate mongoTemplate;

    public MongoDBTestController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("/test-mongo")
    public String testMongoConnection() {
        try {
            mongoTemplate.getDb().getName();
            return "Connexion à MongoDB réussie !";
        } catch (Exception e) {
            return "Échec de la connexion à MongoDB : " + e.getMessage();
        }
    }
}