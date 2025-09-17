package com.sncf.parcautomobile.Services;

import com.sncf.parcautomobile.Entites.*;
import com.sncf.parcautomobile.Repository.BonCarburantRepo;
import com.sncf.parcautomobile.Repository.CarteCarburantRepo;
import com.sncf.parcautomobile.Repository.CarburantRepo;
import com.sncf.parcautomobile.Repository.VehiculeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CarburantService {


    @Autowired
    private VehiculeRepo vehiculeRepo;
    @Autowired
    private CarburantRepo carburantRepo;

    @Autowired
    private CarteCarburantRepo carteCarburantRepo;

    @Autowired
    private BonCarburantRepo bonCarburantRepo;


    public Optional<Vehicule> getVehiculeById(String id) {
        return vehiculeRepo.findById(id);
    }


    public Carburant enregistrerRavitaillement(Carburant ravitaillement) {
        // Validation du mode de paiement
        // Exemple dans CarburantService.java
        if (ravitaillement.getVehicule() == null && ravitaillement.getVehiculeId() != null) {
            Vehicule vehicule = vehiculeRepo.findById(ravitaillement.getVehiculeId()).orElse(null);
            ravitaillement.setVehicule(vehicule);
        } else if ("BON".equals(ravitaillement.getModeUtilisation())) {
            utiliserBonCarburant(ravitaillement.getNumeroPiece());
        }

        // Calcul des statistiques
        calculerStats(ravitaillement);

        return carburantRepo.save(ravitaillement);
    }

    public CarteCarburant creerCarteCarburant(CarteCarburant carte) {
        carte.setActive(true);
        return carteCarburantRepo.save(carte);
    }

    public BonCarburant emettreBoCarburant(BonCarburant bon) {
        bon.setDateEmission(new Date());
        bon.setUtilise(false);
        return bonCarburantRepo.save(bon);
    }

    public List<Carburant> getRavitaillementsVehicule(String vehiculeId, Date debut, Date fin) {
        return carburantRepo.findByVehiculeIdAndDateRavitaillementBetween(vehiculeId, debut, fin);
    }

    private void validerCarteCarburant(String numeroCarte) {
        Optional<CarteCarburant> carte = carteCarburantRepo.findByNumero(numeroCarte);
        if (carte.isEmpty() || !carte.get().isActive()) {
            throw new IllegalArgumentException("Carte carburant invalide ou inactive");
        }
    }

    private void utiliserBonCarburant(String numeroBon) {
        Optional<BonCarburant> bon = bonCarburantRepo.findByNumero(numeroBon);
        if (bon.isEmpty() || bon.get().isUtilise()) {
            throw new IllegalArgumentException("Bon carburant invalide ou déjà utilisé");
        }
        BonCarburant bonCarburant = bon.get();
        bonCarburant.setUtilise(true);
        bonCarburant.setDateUtilisation(new Date());
        bonCarburantRepo.save(bonCarburant);
    }

    private void calculerStats(Carburant ravitaillement) {
        ConsommationStats stats = new ConsommationStats();

        if (ravitaillement.getVehicule() == null) {
            ravitaillement.setStats(stats);
            return;
        }

        Optional<Carburant> dernierRavitaillement = carburantRepo
                .findFirstByVehiculeIdOrderByDateRavitaillementDesc(ravitaillement.getVehicule().getId());

        if (dernierRavitaillement.isPresent()) {
            double distanceParcourue = ravitaillement.getKilometrage() - dernierRavitaillement.get().getKilometrage();
            double consommation = (ravitaillement.getQuantite() * 100) / distanceParcourue;

            stats.setConsommationMoyenne(consommation);
            stats.setDistanceParcourue(distanceParcourue);
            stats.setCoutMoyen(ravitaillement.getMontantTotal() / distanceParcourue);

            if (consommation > 12.0) {
                stats.setAlerteConsommation(true);
                stats.setMessageAlerte("Consommation anormalement élevée détectée");
            }
        }

        ravitaillement.setStats(stats);
    }

    public List<Carburant> findAllCarburants() {
        return carburantRepo.findAll();
    }
}