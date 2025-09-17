package com.sncf.parcautomobile.Entites;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConsommationStats {
    private double consommationMoyenne; // L/100km
    private double distanceParcourue;
    private double coutMoyen; // par km
    private boolean alerteConsommation;
    private String messageAlerte;
}