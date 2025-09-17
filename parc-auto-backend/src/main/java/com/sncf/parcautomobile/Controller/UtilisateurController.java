
package com.sncf.parcautomobile.Controller;

import com.sncf.parcautomobile.Entites.Utilisateur;
import com.sncf.parcautomobile.Services.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/utilisateurs")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @PostMapping("/register")
    public Utilisateur registerUser(@RequestBody Utilisateur utilisateur) {
        return utilisateurService.registerUser(utilisateur);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUserById(@PathVariable String id) {
        return utilisateurService.getUserById(id);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<Utilisateur> getUserByUsername(@PathVariable String username) {
        return utilisateurService.getUserByUsername(username);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Utilisateur>> getAllUtilisateurs() {
        return ResponseEntity.ok(utilisateurService.findAllUtilisateurs());
    }
}