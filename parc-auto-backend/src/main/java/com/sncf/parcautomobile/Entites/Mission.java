package com.sncf.parcautomobile.Entites;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "missions")
@Getter
@Setter
public class Mission {
    @Id
    private String id;
    private Date dateDebut;
    private Date dateFin;
    private String itineraire;
    private String description;
    private String statut; // EN_ATTENTE, EN_COURS, TERMINEE, VALIDEE, ANNULEE
    private Date dateCreation;
    private Date dateModification;
    private String commentaireValidation;
    
    @DBRef
    private Vehicule vehicule;
    
    @DBRef
    private Utilisateur utilisateur;  // Conducteur
    
    @DBRef
    private Utilisateur validateur;   // Responsable qui valide
    
    private List<StatusHistory> statusHistory = new ArrayList<>();
    
    // Au lieu de @PrePersist, nous gérons cela dans le service
    public void initialiserMission() {
        this.dateCreation = new Date();
        this.dateModification = this.dateCreation;
        this.statut = "EN_ATTENTE";
        addStatusHistory("EN_ATTENTE", "Création de la mission");
    }
    
    // Au lieu de @PreUpdate
    public void mettreAJourDate() {
        this.dateModification = new Date();
    }
    
    public void addStatusHistory(String status, String commentaire) {
        if (this.statusHistory == null) {
            this.statusHistory = new ArrayList<>();
        }
        this.statusHistory.add(new StatusHistory(status, commentaire, new Date()));
    }
}