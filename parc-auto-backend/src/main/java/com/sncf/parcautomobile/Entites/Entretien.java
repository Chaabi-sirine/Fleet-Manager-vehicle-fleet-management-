
package com.sncf.parcautomobile.Entites;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "entretiens")
@Getter
@Setter
public class Entretien {
    @Id
    private String id;
    private Date date;
    private String typeEntretien;
    private String description;

    @DBRef
    private Vehicule vehicule;

    public Entretien() {}

    public Entretien(String id, Date date, String typeEntretien, String description) {
        this.id = id;
        this.date = date;
        this.typeEntretien = typeEntretien;
        this.description = description;
    }
}