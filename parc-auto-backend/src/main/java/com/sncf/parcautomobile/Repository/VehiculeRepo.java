package com.sncf.parcautomobile.Repository;

import com.sncf.parcautomobile.Entites.Vehicule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehiculeRepo extends MongoRepository<Vehicule, String> {
    List<Vehicule> findByCategorie(String categorie);
    List<Vehicule> findByResponsable(String responsableId);
}