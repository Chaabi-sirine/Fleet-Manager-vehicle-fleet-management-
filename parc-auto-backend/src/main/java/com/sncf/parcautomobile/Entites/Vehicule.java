package com.sncf.parcautomobile.Entites;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Date;

@Document(collection = "vehicules")
@Data
public class Vehicule {
    @Id
    private String id;
    private String immatriculation;
    private String marque;
    private String modele;
    private int annee;
    
    // Catégorisation
    private String categorie;        // MISSION, SERVICE, POOL
    private String responsable;      // ID du responsable
    private String departement;
    
    // Suivi kilométrage
    private Double kilometrageActuel;
    private List<KilometrageMensuel> historiqueKilometrage;
    
    // État disponibilité
    private String statut;           // DISPONIBLE, EN_MISSION, EN_MAINTENANCE, HORS_SERVICE
    private Date dateDerniereMaintenance;
    private Date prochaineRevision;
    
    // Documents véhicule
    private List<DocumentVehicule> documents;

    @Data
    public static class KilometrageMensuel {
        private Date date;
        private Double kilometrage;
        private String commentaire;
    }

    @Data
    public static class DocumentVehicule {
        private String type;            // ASSURANCE, CARTE_GRISE, CONTROLE_TECHNIQUE
        private String numero;
        private Date dateExpiration;
        private String fichier;         // URL ou chemin du document
        private boolean estValide;
    }
}