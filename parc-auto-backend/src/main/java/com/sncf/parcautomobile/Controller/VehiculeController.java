package com.sncf.parcautomobile.Controller;

import com.sncf.parcautomobile.Entites.Vehicule;
import com.sncf.parcautomobile.Entites.Vehicule.DocumentVehicule;
import com.sncf.parcautomobile.Entites.Vehicule.KilometrageMensuel;
import com.sncf.parcautomobile.Services.VehiculeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicules")
@Tag(name = "Gestion des Véhicules", description = "API pour la gestion avancée des véhicules")
public class VehiculeController {

    @Autowired
    private VehiculeService vehiculeService;

    @Operation(summary = "Ajouter un nouveau véhicule")
    // @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Vehicule> ajouterVehicule(@RequestBody Vehicule vehicule) {
        return ResponseEntity.ok(vehiculeService.ajouterVehicule(vehicule));
    }

    @Operation(summary = "Mettre à jour le kilométrage")
    //@PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    @PutMapping("/{id}/kilometrage")
    public ResponseEntity<Vehicule> updateKilometrage(
            @PathVariable String id,
            @RequestBody KilometrageMensuel kilometrage) {
        return ResponseEntity.ok(vehiculeService.updateKilometrage(id, kilometrage));
    }

    @Operation(summary = "Changer le statut du véhicule")
    //@PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    @PutMapping("/{id}/statut")
    public ResponseEntity<Vehicule> updateStatut(
            @PathVariable String id,
            @RequestParam String nouveauStatut) {
        return ResponseEntity.ok(vehiculeService.updateStatut(id, nouveauStatut));
    }

    @Operation(summary = "Ajouter un document au véhicule")
    //@PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/documents")
    public ResponseEntity<Vehicule> ajouterDocument(
            @PathVariable String id,
            @RequestBody Vehicule.DocumentVehicule document) {
        return ResponseEntity.ok(vehiculeService.ajouterDocument(id, document));
    }


    @Operation(summary = "Obtenir les véhicules par catégorie")
    //@PreAuthorize("isAuthenticated()")
    @GetMapping("/categorie/{categorie}")
    public ResponseEntity<List<Vehicule>> getByCategorie(@PathVariable String categorie) {
        return ResponseEntity.ok(vehiculeService.getByCategorie(categorie));
    }

    @Operation(summary = "Obtenir les véhicules par responsable")
    //@PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    @GetMapping("/responsable/{responsableId}")
    public ResponseEntity<List<Vehicule>> getByResponsable(@PathVariable String responsableId) {
        return ResponseEntity.ok(vehiculeService.getByResponsable(responsableId));
    }

    @Operation(summary = "Obtenir les véhicules nécessitant une maintenance")
    //@PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    @GetMapping("/maintenance-requise")
    public ResponseEntity<List<Vehicule>> getVehiculesMaintenanceRequise() {
        return ResponseEntity.ok(vehiculeService.getVehiculesMaintenanceRequise());
    }

    @Operation(summary = "Obtenir l'historique kilométrage")
    //@PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}/historique-kilometrage")
    public ResponseEntity<List<KilometrageMensuel>> getHistoriqueKilometrage(
            @PathVariable String id) {
        return ResponseEntity.ok(vehiculeService.getHistoriqueKilometrage(id));
    }
    @GetMapping
    public ResponseEntity<List<Vehicule>> getAllVehicules() {
        return ResponseEntity.ok(vehiculeService.getAllVehicules());
    }
}