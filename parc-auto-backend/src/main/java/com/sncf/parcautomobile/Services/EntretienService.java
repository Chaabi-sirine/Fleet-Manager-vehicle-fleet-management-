
package com.sncf.parcautomobile.Services;

import com.sncf.parcautomobile.Entites.Entretien;
import com.sncf.parcautomobile.Repository.EntretienRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EntretienService {

    @Autowired
    private EntretienRepo entretienRepo;

    public List<Entretien> getAllEntretiens() {
        return entretienRepo.findAll();
    }

    public Entretien createEntretien(Entretien entretien) {
        return entretienRepo.save(entretien);
    }

    public ResponseEntity<Entretien> getEntretienById(String id) {
        return entretienRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public List<Entretien> getEntretiensByVehicule(String vehiculeId) {
        return entretienRepo.findByVehiculeId(vehiculeId);
    }
}