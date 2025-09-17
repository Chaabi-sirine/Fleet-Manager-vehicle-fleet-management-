
package com.sncf.parcautomobile.Services;

import com.sncf.parcautomobile.Entites.Utilisateur;
import com.sncf.parcautomobile.Repository.UtilisateurRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepo utilisateurRepo;

    public Utilisateur registerUser(Utilisateur utilisateur) {
        return utilisateurRepo.save(utilisateur);
    }

    public ResponseEntity<Utilisateur> getUserById(String id) {
        return utilisateurRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Utilisateur> getUserByUsername(String username) {
        return utilisateurRepo.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public List<Utilisateur> findAllUtilisateurs() {
        return utilisateurRepo.findAll();
    }
}