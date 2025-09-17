package com.sncf.parcautomobile.Services;

import com.sncf.parcautomobile.Entites.Mission;
import com.sncf.parcautomobile.Entites.Utilisateur;
import com.sncf.parcautomobile.Repository.MissionRepo;
import com.sncf.parcautomobile.dto.MissionEvolutionDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class MissionService {

    @Autowired
    private MissionRepo missionRepo;

    // Java
    public Mission createMission(Mission mission) {

        validateVehiculeDisponibility(mission);
        mission.initialiserMission();
        return missionRepo.save(mission);
    }

    public ResponseEntity<Mission> validerMission(String id, String commentaire, Utilisateur validateur) {
        return missionRepo.findById(id)
            .map(mission -> {
                mission.setStatut("VALIDEE");
                mission.setValidateur(validateur);
                mission.setCommentaireValidation(commentaire);
                mission.addStatusHistory("VALIDEE", commentaire);
                mission.mettreAJourDate();
                return ResponseEntity.ok(missionRepo.save(mission));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Mission> demarrerMission(String id) {
        return missionRepo.findById(id)
            .map(mission -> {
                if (!"VALIDEE".equals(mission.getStatut())) {
                    throw new IllegalStateException("La mission doit être validée avant de démarrer");
                }
                mission.setStatut("EN_COURS");
                mission.addStatusHistory("EN_COURS", "Démarrage de la mission");
                mission.mettreAJourDate();
                return ResponseEntity.ok(missionRepo.save(mission));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    public ResponseEntity<Mission> terminerMission(String id, String commentaire) {
        return missionRepo.findById(id)
            .map(mission -> {
                mission.setStatut("TERMINEE");
                mission.addStatusHistory("TERMINEE", commentaire);
                mission.mettreAJourDate();
                return ResponseEntity.ok(missionRepo.save(mission));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    public List<Mission> getMissionsEnCours() {
        return missionRepo.findByStatut("EN_COURS");
    }

    public List<Mission> getMissionsParPeriode(Date debut, Date fin) {
        return missionRepo.findByDateDebutBetween(debut, fin);
    }

    private void validateVehiculeDisponibility(Mission newMission) {
        if (newMission.getVehicule() == null || newMission.getVehicule().getId() == null) {
            throw new IllegalArgumentException("Le véhicule est requis pour la mission");
        }

        List<Mission> missionsVehicule = missionRepo.findByVehiculeId(newMission.getVehicule().getId());


    }

    private boolean datesOverlap(Mission mission1, Mission mission2) {
        if (mission1.getDateDebut() == null || mission1.getDateFin() == null ||
            mission2.getDateDebut() == null || mission2.getDateFin() == null) {
            throw new IllegalArgumentException("Les dates de début et de fin sont requises");
        }

        return !mission1.getDateFin().before(mission2.getDateDebut()) &&
               !mission2.getDateFin().before(mission1.getDateDebut());
    }


    public List<Mission> getAllMissions() {
        return missionRepo.findAll();
    }


   // -------------------------------------
   // parc-auto-backend/src/main/java/com/sncf/parcautomobile/service/MissionService.java
   public List<MissionEvolutionDTO> getEvolutionDerniers6Mois() {
       // ... logique d’agrégation ...
       List<MissionEvolutionDTO> result = new ArrayList<>();
       // Remplir la liste avec les données agrégées
       result.add(new MissionEvolutionDTO("2025-04", 12));
       // etc.
       return result;
   }
}