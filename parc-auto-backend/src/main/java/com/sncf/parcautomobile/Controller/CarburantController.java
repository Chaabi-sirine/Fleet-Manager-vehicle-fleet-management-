package com.sncf.parcautomobile.Controller;

import com.sncf.parcautomobile.Entites.BonCarburant;
import com.sncf.parcautomobile.Entites.CarteCarburant;
import com.sncf.parcautomobile.Entites.Carburant;
import com.sncf.parcautomobile.Services.CarburantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/carburant")
@Tag(name = "Gestion Carburant", description = "API pour la gestion du carburant")
@SecurityRequirement(name = "bearerAuth")
public class CarburantController {

    @Autowired
    private CarburantService carburantService;
    
    @Operation(summary = "Enregistrer un ravitaillement",
            description = "Permet d'enregistrer un nouveau ravitaillement de carburant")
    @ApiResponse(responseCode = "200", description = "Ravitaillement enregistré avec succès")
    //@PreAuthorize("hasAnyRole('CONDUCTEUR', 'RESPONSABLE')")
    @PostMapping("/ravitaillement")
    public ResponseEntity<Carburant> enregistrerRavitaillement(@RequestBody Carburant ravitaillement) {
        return ResponseEntity.ok(carburantService.enregistrerRavitaillement(ravitaillement));
    }
    
    @Operation(summary = "Créer une carte carburant",
            description = "Permet de créer une nouvelle carte carburant")
    @ApiResponse(responseCode = "200", description = "Carte carburant créée avec succès")
    //@PreAuthorize("hasRole('RESPONSABLE')")
    @PostMapping("/cartes")
    public ResponseEntity<CarteCarburant> creerCarte(@RequestBody CarteCarburant carte) {
        return ResponseEntity.ok(carburantService.creerCarteCarburant(carte));
    }
    
    @Operation(summary = "Émettre un bon carburant",
            description = "Permet d'émettre un nouveau bon de carburant")
    @ApiResponse(responseCode = "200", description = "Bon carburant émis avec succès")
    //@PreAuthorize("hasRole('RESPONSABLE')")
    @PostMapping("/bons")
    public ResponseEntity<BonCarburant> emettreBoCarburant(@RequestBody BonCarburant bon) {
        return ResponseEntity.ok(carburantService.emettreBoCarburant(bon));
    }
    
    @Operation(summary = "Obtenir l'historique des ravitaillements",
            description = "Récupère l'historique des ravitaillements d'un véhicule pour une période donnée")
    @ApiResponse(responseCode = "200", description = "Historique récupéré avec succès")
    //@PreAuthorize("isAuthenticated()")
    @GetMapping("/vehicule/{vehiculeId}")
    public ResponseEntity<List<Carburant>> getRavitaillements(
            @PathVariable String vehiculeId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date debut,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date fin) {
        return ResponseEntity.ok(carburantService.getRavitaillementsVehicule(vehiculeId, debut, fin));
    }


    @GetMapping("/all")
    public ResponseEntity<List<Carburant>> getAllCarburants() {
        return ResponseEntity.ok(carburantService.findAllCarburants());
    }
}