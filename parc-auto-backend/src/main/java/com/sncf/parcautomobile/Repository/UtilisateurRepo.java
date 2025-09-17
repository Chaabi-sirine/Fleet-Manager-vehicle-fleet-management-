
package com.sncf.parcautomobile.Repository;

import com.sncf.parcautomobile.Entites.Utilisateur;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepo extends MongoRepository<Utilisateur, String> {
    Optional<Utilisateur> findByUsername(String username);
    List<Utilisateur> findAll();
}