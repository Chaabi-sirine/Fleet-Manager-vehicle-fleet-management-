package com.sncf.parcautomobile.Entites;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Document(collection = "cartes_carburant")
@Getter
@Setter
public class CarteCarburant {
    @Id
    private String id;
    private String numero;
    private String code;
    private Date dateExpiration;
    private boolean active;
    private double plafondMensuel;
    private String fournisseur;
    
    @DBRef
    private Vehicule vehiculeAssigne;
}