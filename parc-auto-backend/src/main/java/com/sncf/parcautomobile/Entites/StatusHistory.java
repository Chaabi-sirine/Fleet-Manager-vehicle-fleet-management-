package com.sncf.parcautomobile.Entites;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class StatusHistory {
    private String status;
    private String commentaire;
    private Date dateChangement;
}