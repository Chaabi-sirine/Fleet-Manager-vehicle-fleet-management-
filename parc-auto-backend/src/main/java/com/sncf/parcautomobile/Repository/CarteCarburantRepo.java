package com.sncf.parcautomobile.Repository;

import com.sncf.parcautomobile.Entites.CarteCarburant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarteCarburantRepo extends MongoRepository<CarteCarburant, String> {
    List<CarteCarburant> findByActive(boolean active);
    Optional<CarteCarburant> findByNumero(String numero);
    List<CarteCarburant> findByVehiculeAssigneId(String vehiculeId);
}