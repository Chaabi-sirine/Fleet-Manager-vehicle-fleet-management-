// parc-auto-backend/src/main/java/com/sncf/parcautomobile/dto/MissionEvolutionDTO.java
package com.sncf.parcautomobile.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MissionEvolutionDTO {
    private String mois;
    private long missions;
}