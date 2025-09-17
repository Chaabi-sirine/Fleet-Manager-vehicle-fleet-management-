package com.sncf.parcautomobile.Repository;

import com.sncf.parcautomobile.Entites.SecurityUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SecurityUserRepo extends MongoRepository<SecurityUser, String> {
    Optional<SecurityUser> findByUsername(String username);
    boolean existsByUsername(String username);
}