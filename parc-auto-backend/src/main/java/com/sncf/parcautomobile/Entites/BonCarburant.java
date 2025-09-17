package com.sncf.parcautomobile.Entites;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "bons_carburant")
@Getter
@Setter
public class BonCarburant {
    @Id
    private String id;
    private String numero;
    private double montant;
    private Date dateEmission;
    private Date dateUtilisation;
    private boolean utilise;
    private String station;
    
    @DBRef
    private Vehicule vehicule;
    
    @DBRef
    private Utilisateur utilisateur;
}