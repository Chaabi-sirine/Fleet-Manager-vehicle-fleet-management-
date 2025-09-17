package com.sncf.parcautomobile.Entites;

import jakarta.validation.constraints.Min;
import lombok.Value;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

// JwtConfig.java
@Configuration
public class JwtConfig {
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    @Min(value = 1000, message = "L'expiration doit être d'au moins 1 seconde")
    private Duration expiration;
    
    public Duration getExpiration() {
        return expiration;
    }
}