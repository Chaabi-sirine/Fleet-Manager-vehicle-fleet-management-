package com.sncf.parcautomobile.Repository;

import com.sncf.parcautomobile.Entites.Carburant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarburantRepo extends MongoRepository<Carburant, String> {
    Optional<Carburant> findFirstByVehiculeIdOrderByDateRavitaillementDesc(String vehiculeId);
    List<Carburant> findByVehiculeIdAndDateRavitaillementBetween(String vehiculeId, Date debut, Date fin);
    List<Carburant> findAll();
}

