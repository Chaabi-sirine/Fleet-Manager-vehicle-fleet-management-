
package com.sncf.parcautomobile.Controller;

import com.sncf.parcautomobile.Entites.Entretien;
import com.sncf.parcautomobile.Services.EntretienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/entretiens")
public class EntretienController {

    @Autowired
    private EntretienService entretienService;

    @GetMapping
    public List<Entretien> getAllEntretiens() {
        return entretienService.getAllEntretiens();
    }

    @PostMapping
    public Entretien createEntretien(@RequestBody Entretien entretien) {
        return entretienService.createEntretien(entretien);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entretien> getEntretienById(@PathVariable String id) {
        return entretienService.getEntretienById(id);
    }

    @GetMapping("/vehicule/{vehiculeId}")
    public List<Entretien> getEntretiensByVehicule(@PathVariable String vehiculeId) {
        return entretienService.getEntretiensByVehicule(vehiculeId);
    }
}