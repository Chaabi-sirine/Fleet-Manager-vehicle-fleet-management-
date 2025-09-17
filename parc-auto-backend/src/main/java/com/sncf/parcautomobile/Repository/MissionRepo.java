package com.sncf.parcautomobile.Repository;

import com.sncf.parcautomobile.Entites.Mission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface MissionRepo extends MongoRepository<Mission, String> {
    List<Mission> findByVehiculeId(String vehiculeId);
    List<Mission> findByStatut(String statut);
    List<Mission> findByDateDebutBetween(Date debut, Date fin);
}