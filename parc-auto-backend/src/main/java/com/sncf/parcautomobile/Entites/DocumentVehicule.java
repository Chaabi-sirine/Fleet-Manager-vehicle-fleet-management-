package com.sncf.parcautomobile.Entites;

import lombok.Data;
import java.util.Date;

@Data
public class DocumentVehicule {
    private String type;            // ASSURANCE, CARTE_GRISE, CONTROLE_TECHNIQUE
    private String numero;
    private Date dateExpiration;
    private String fichier;         // URL ou chemin du document
    private boolean estValide;
}