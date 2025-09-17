package com.sncf.parcautomobile.Entites;

import lombok.Data;
import java.util.Date;

@Data
public class KilometrageMensuel {
    private Date date;
    private Double kilometrage;
    private String commentaire;
}