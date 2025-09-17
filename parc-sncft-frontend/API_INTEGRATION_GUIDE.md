# Documentation de l'Intégration API

## Vue d'ensemble

Cette documentation explique comment le front-end Angular est configuré pour communiquer avec l'API backend.

## Configuration de l'API

### URL de Base
- **Développement**: `http://localhost:8080/api/v1`
- **Production**: Configuré dans `src/environments/environment.prod.ts`

### Structure des Services

#### 1. ApiService (Service de Base)
Le service principal pour toutes les communications HTTP :

```typescript
// Exemple d'utilisation
this.apiService.get<User[]>('/utilisateurs', params)
this.apiService.post<User>('/utilisateurs', userData)
this.apiService.put<User>('/utilisateurs/123', updateData)
this.apiService.delete<void>('/utilisateurs/123')
```

#### 2. Services Spécialisés

**ReportsService** - Gestion des rapports
```typescript
// Récupérer tous les rapports
this.reportsService.getAllReports({ type: 'monthly', limit: 10 })

// Générer un rapport
this.reportsService.generateReport('report-id')

// Télécharger un rapport
this.reportsService.downloadReport('report-id', 'PDF')
```

**UsersService** - Gestion des utilisateurs
```typescript
// Récupérer les utilisateurs
this.usersService.getAllUsers({ department: 'IT', isActive: true })

// Créer un utilisateur
this.usersService.createUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  roleId: 'role-id',
  department: 'IT'
})
```

**VehiclesService** - Gestion des véhicules
```typescript
// Récupérer les véhicules disponibles
this.vehiclesService.getAvailableVehicles(startDate, endDate, 'bus')

// Mettre à jour le statut d'un véhicule
this.vehiclesService.updateVehicleStatus('vehicle-id', 'en_maintenance', 'Révision périodique')
```

**NotificationsService** - Gestion des notifications temps réel
```typescript
// S'abonner aux notifications
this.notificationsService.notifications$.subscribe(notifications => {
  // Traiter les notifications
})

// Marquer comme lu
this.notificationsService.markNotificationAsRead('notification-id')
```

## Endpoints de l'API

### Rapports
- `GET /rapports` - Liste tous les rapports
- `GET /rapports/{id}` - Récupère un rapport par ID
- `POST /rapports` - Crée un nouveau rapport
- `PUT /rapports/{id}` - Met à jour un rapport
- `DELETE /rapports/{id}` - Supprime un rapport
- `POST /rapports/{id}/generate` - Génère un rapport
- `GET /rapports/{id}/download` - Télécharge un rapport

### Utilisateurs
- `GET /utilisateurs` - Liste tous les utilisateurs
- `GET /utilisateurs/{id}` - Récupère un utilisateur par ID
- `POST /utilisateurs` - Crée un nouvel utilisateur
- `PUT /utilisateurs/{id}` - Met à jour un utilisateur
- `DELETE /utilisateurs/{id}` - Supprime un utilisateur
- `PATCH /utilisateurs/{id}/status` - Active/désactive un utilisateur
- `POST /utilisateurs/{id}/reset-password` - Réinitialise le mot de passe

### Véhicules
- `GET /vehicules` - Liste tous les véhicules
- `GET /vehicules/{id}` - Récupère un véhicule par ID
- `POST /vehicules` - Crée un nouveau véhicule
- `PUT /vehicules/{id}` - Met à jour un véhicule
- `DELETE /vehicules/{id}` - Supprime un véhicule
- `PATCH /vehicules/{id}/status` - Met à jour le statut
- `GET /vehicules/available` - Véhicules disponibles
- `GET /vehicules/stats` - Statistiques des véhicules

### Notifications
- `GET /notifications` - Liste des notifications
- `POST /notifications` - Crée une notification
- `PATCH /notifications/{id}/read` - Marque comme lue
- `DELETE /notifications/{id}` - Supprime une notification

## Format des Données

### Structure de Réponse Standard
```json
{
  "success": true,
  "data": { /* données de la réponse */ },
  "message": "Opération réussie",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Gestion des Erreurs
```json
{
  "success": false,
  "error": "Message d'erreur",
  "message": "Description détaillée",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## Méthodes HTTP Utilisées

- **GET** : Récupération de données
- **POST** : Création de nouvelles ressources
- **PUT** : Mise à jour complète d'une ressource
- **PATCH** : Mise à jour partielle d'une ressource
- **DELETE** : Suppression d'une ressource

## Paramètres de Requête

### Filtrage et Pagination
```typescript
// Exemple de paramètres
{
  limit: 20,           // Nombre d'éléments par page
  offset: 0,           // Décalage pour la pagination
  search: 'term',      // Terme de recherche
  type: 'monthly',     // Filtrage par type
  status: 'active',    // Filtrage par statut
  department: 'IT'     // Filtrage par département
}
```

### Upload de Fichiers
```typescript
// Upload d'image pour un véhicule
const formData = new FormData();
formData.append('file', imageFile);
this.vehiclesService.uploadVehicleImages(vehicleId, [imageFile])
```

## Gestion des Erreurs

### Codes d'Erreur HTTP
- **400** : Requête malformée
- **401** : Non autorisé
- **403** : Accès interdit
- **404** : Ressource non trouvée
- **500** : Erreur serveur interne

### Retry et Timeout
- **Retry** : 1 tentative automatique
- **Timeout** : 30 secondes par défaut
- **Upload Timeout** : 60 secondes
- **Download Timeout** : 120 secondes

## Sécurité

### Headers
```typescript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer {token}' // Si authentification requise
}
```

### CORS
L'API backend doit être configurée pour accepter les requêtes depuis :
- `http://localhost:4200` (développement)
- Domaine de production

## Intégration dans les Composants

### Dashboard
Le dashboard utilise `forkJoin` pour charger plusieurs données en parallèle :

```typescript
ngOnInit(): void {
  this.loadDashboardData();
  
  // Auto-refresh toutes les 30 secondes
  this.refreshInterval$.pipe(
    takeUntil(this.destroy$),
    switchMap(() => this.loadDashboardData())
  ).subscribe();
}
```

### État des Données
- **Loading States** : `isRefreshing` pour indiquer le chargement
- **Error Handling** : Gestion gracieuse des erreurs avec fallback
- **Real-time Updates** : Notifications en temps réel via observables

## Exemple d'Implémentation Backend

### Structure de l'API Backend (exemple Spring Boot)

```java
@RestController
@RequestMapping("/api/v1")
public class RapportController {
    
    @GetMapping("/rapports")
    public ResponseEntity<ApiResponse<List<Rapport>>> getAllRapports(
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String status,
        @RequestParam(defaultValue = "20") int limit,
        @RequestParam(defaultValue = "0") int offset
    ) {
        // Implementation
        return ResponseEntity.ok(new ApiResponse<>(true, rapports, "Success"));
    }
    
    @PostMapping("/rapports")
    public ResponseEntity<ApiResponse<Rapport>> createRapport(@RequestBody CreateRapportRequest request) {
        // Implementation
        return ResponseEntity.ok(new ApiResponse<>(true, newRapport, "Rapport créé"));
    }
}
```

## Tests

### Tests Unitaires des Services
```typescript
describe('ReportsService', () => {
  it('should fetch reports', () => {
    service.getAllReports().subscribe(response => {
      expect(response.success).toBeTruthy();
      expect(response.data).toBeDefined();
    });
  });
});
```

## Configuration d'Environnement

### Fichiers d'environnement
- `src/environments/environment.ts` (développement)
- `src/environments/environment.prod.ts` (production)

### Variables configurables
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  timeout: 30000,
  enableLogging: true
};
```

Cette documentation devrait vous permettre de comprendre et utiliser l'intégration API entre le front-end Angular et le backend.
