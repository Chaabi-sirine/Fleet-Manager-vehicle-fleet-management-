package com.sncf.parcautomobile.Repository;

import com.sncf.parcautomobile.Entites.BonCarburant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BonCarburantRepo extends MongoRepository<BonCarburant, String> {
    List<BonCarburant> findByUtilise(boolean utilise);
    Optional<BonCarburant> findByNumero(String numero);
    List<BonCarburant> findByVehiculeId(String vehiculeId);
}