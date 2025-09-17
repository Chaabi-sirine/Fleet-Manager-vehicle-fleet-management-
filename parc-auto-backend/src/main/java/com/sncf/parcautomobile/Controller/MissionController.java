package com.sncf.parcautomobile.Controller;

import com.sncf.parcautomobile.Entites.Mission;
import com.sncf.parcautomobile.Entites.Utilisateur;
import com.sncf.parcautomobile.Services.MissionService;
import com.sncf.parcautomobile.dto.MissionEvolutionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
@RestController
@RequestMapping("/api/v1/missions")
public class MissionController {

    @Autowired
    private MissionService missionService;

    //@PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    @PostMapping
    public ResponseEntity<Mission> createMission(@RequestBody Mission mission) {
        if (mission.getVehicule() == null || mission.getVehicule().getId() == null) {
            throw new IllegalArgumentException("L'id du véhicule doit être renseigné.");
        }
        return ResponseEntity.ok(missionService.createMission(mission));
    }

    //@PreAuthorize("hasRole('RESPONSABLE')")
    @PutMapping("/{id}/valider")
    public ResponseEntity<Mission> validerMission(
            @PathVariable String id,
            @RequestParam String commentaire,
            @AuthenticationPrincipal Utilisateur validateur) {
        return missionService.validerMission(id, commentaire, validateur);
    }

    //@PreAuthorize("hasAnyRole('CONDUCTEUR', 'RESPONSABLE')")
    @PutMapping("/{id}/demarrer")
    public ResponseEntity<Mission> demarrerMission(@PathVariable String id) {
        return missionService.demarrerMission(id);
    }

   // @PreAuthorize("hasAnyRole('CONDUCTEUR', 'RESPONSABLE')")
    @PutMapping("/{id}/terminer")
    public ResponseEntity<Mission> terminerMission(
            @PathVariable String id,
            @RequestParam String commentaire) {
        return missionService.terminerMission(id, commentaire);
    }

    //@PreAuthorize("isAuthenticated()")
    @GetMapping("/en-cours")
    public List<Mission> getMissionsEnCours() {
        return missionService.getMissionsEnCours();
    }

    //@PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    @GetMapping("/periode")
    public List<Mission> getMissionsParPeriode(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date debut,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date fin) {
        return missionService.getMissionsParPeriode(debut, fin);
    }

    @GetMapping
    public ResponseEntity<List<Mission>> getAllMissions() {
        List<Mission> missions = missionService.getAllMissions();
        return ResponseEntity.ok(missions);
    }

    // parc-auto-backend/src/main/java/com/sncf/parcautomobile/controller/MissionController.java
    @GetMapping("/evolution")
    public List<MissionEvolutionDTO> getEvolutionMissions() {
        return missionService.getEvolutionDerniers6Mois();
    }
}