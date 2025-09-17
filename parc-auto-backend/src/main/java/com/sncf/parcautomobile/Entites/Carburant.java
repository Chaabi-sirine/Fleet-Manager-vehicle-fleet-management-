package com.sncf.parcautomobile.Entites;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Document(collection = "carburants")
@Getter
@Setter
public class Carburant {
    @Id
    private String id;
    private String type;
    private double quantite;
    private double prixUnitaire;
    private double montantTotal;
    private Date dateRavitaillement;
    private String station;
    private double kilometrage;
    private String modeUtilisation; // CARTE ou BON
    private String numeroPiece; // Numéro de carte ou de bon
    
    @DBRef
    private Vehicule vehicule;
    
    @DBRef
    private Mission mission;
    
    @DBRef
    private Utilisateur utilisateur;
    
    private ConsommationStats stats; // Statistiques calculées


    public String getVehiculeId() {
        return vehicule != null ? vehicule.getId() : null;
    }
}
