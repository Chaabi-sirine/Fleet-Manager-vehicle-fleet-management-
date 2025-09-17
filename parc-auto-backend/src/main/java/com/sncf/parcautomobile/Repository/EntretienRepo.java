
package com.sncf.parcautomobile.Repository;

import com.sncf.parcautomobile.Entites.Entretien;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntretienRepo extends MongoRepository<Entretien, String> {
    List<Entretien> findByVehiculeId(String vehiculeId);
}