package com.sncf.parcautomobile.Services;

import com.sncf.parcautomobile.Entites.Vehicule;
import com.sncf.parcautomobile.Entites.Vehicule.DocumentVehicule;
import com.sncf.parcautomobile.Entites.Vehicule.KilometrageMensuel;
import com.sncf.parcautomobile.Repository.VehiculeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class VehiculeService {

    @Autowired
    private VehiculeRepo vehiculeRepo;

    public Vehicule ajouterVehicule(Vehicule vehicule) {
        return vehiculeRepo.save(vehicule);
    }

    public List<Vehicule> getAllVehicules() {
        return vehiculeRepo.findAll();}

    public ResponseEntity<Vehicule> getVehiculeById(String id) {
        return vehiculeRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public Vehicule updateKilometrage(String id, KilometrageMensuel kilometrage) {
        Vehicule vehicule = vehiculeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));

        vehicule.setKilometrageActuel(kilometrage.getKilometrage());

        if (vehicule.getHistoriqueKilometrage() == null) {
            vehicule.setHistoriqueKilometrage(new ArrayList<>());
        }
        vehicule.getHistoriqueKilometrage().add(kilometrage);

        return vehiculeRepo.save(vehicule);
    }

    public Vehicule updateStatut(String id, String nouveauStatut) {
        Vehicule vehicule = vehiculeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));

        vehicule.setStatut(nouveauStatut);

        if (nouveauStatut.equals("EN_MAINTENANCE")) {
            vehicule.setDateDerniereMaintenance(new Date());
        }

        return vehiculeRepo.save(vehicule);
    }

    public Vehicule ajouterDocument(String id, DocumentVehicule document) {
        Vehicule vehicule = vehiculeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));

        if (vehicule.getDocuments() == null) {
            vehicule.setDocuments(new ArrayList<>());
        }
        vehicule.getDocuments().add(document);

        return vehiculeRepo.save(vehicule);
    }

    public List<Vehicule> getByCategorie(String categorie) {
        return vehiculeRepo.findByCategorie(categorie);
    }

    public List<Vehicule> getByResponsable(String responsableId) {
        return vehiculeRepo.findByResponsable(responsableId);
    }

    public List<Vehicule> getVehiculesMaintenanceRequise() {
        List<Vehicule> vehicules = vehiculeRepo.findAll();
        List<Vehicule> maintenanceRequise = new ArrayList<>();

        Date now = new Date();
        for (Vehicule vehicule : vehicules) {
            if (vehicule.getProchaineRevision() != null &&
                vehicule.getProchaineRevision().before(now)) {
                maintenanceRequise.add(vehicule);
            }
        }

        return maintenanceRequise;
    }

    public List<KilometrageMensuel> getHistoriqueKilometrage(String id) {
        Vehicule vehicule = vehiculeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));

        return vehicule.getHistoriqueKilometrage();
    }
}