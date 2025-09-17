
package com.sncf.parcautomobile.Entites;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "utilisateurs")
@Getter
@Setter
public class Utilisateur {
    @Id
    private String id;
    private String username;
    private String password;
    private String role;

    public Utilisateur() {}

    public Utilisateur(String id, String username, String password, String role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }
}