import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService, ApiResponse } from './api.service';

// Interfaces pour les notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'maintenance' | 'warning';
  isRead: boolean;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  userId?: string;
  metadata?: { [key: string]: any };
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: { [type: string]: number };
  byPriority: { [priority: string]: number };
  todayCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private readonly endpoint = '/notifications';
  
  // State management pour les notifications en temps réel
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  
  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Initialiser les notifications au démarrage
    this.loadNotifications();
  }

  // ============================================
  // MÉTHODES CRUD POUR LES NOTIFICATIONS
  // ============================================

  /**
   * Récupère toutes les notifications
   * @param filters - Filtres optionnels
   * @returns Observable<ApiResponse<Notification[]>>
   */
  getAllNotifications(filters?: {
    type?: Notification['type'];
    priority?: Notification['priority'];
    isRead?: boolean;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Observable<ApiResponse<Notification[]>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.type) params = params.set('type', filters.type);
      if (filters.priority) params = params.set('priority', filters.priority);
      if (filters.isRead !== undefined) params = params.set('isRead', filters.isRead.toString());
      if (filters.userId) params = params.set('userId', filters.userId);
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.offset) params = params.set('offset', filters.offset.toString());
    }

    return this.apiService.get<Notification[]>(this.endpoint, params);
  }

  /**
   * Récupère une notification par ID
   * @param id - ID de la notification
   * @returns Observable<ApiResponse<Notification>>
   */
  getNotificationById(id: string): Observable<ApiResponse<Notification>> {
    return this.apiService.get<Notification>(`${this.endpoint}/${id}`);
  }

  /**
   * Crée une nouvelle notification
   * @param notificationData - Données de la notification
   * @returns Observable<ApiResponse<Notification>>
   */
  createNotification(notificationData: Omit<Notification, 'id' | 'timestamp'>): Observable<ApiResponse<Notification>> {
    return this.apiService.post<Notification>(this.endpoint, notificationData);
  }

  /**
   * Marque une notification comme lue
   * @param id - ID de la notification
   * @returns Observable<ApiResponse<Notification>>
   */
  markAsRead(id: string): Observable<ApiResponse<Notification>> {
    return this.apiService.patch<Notification>(`${this.endpoint}/${id}/read`, { isRead: true });
  }

  /**
   * Marque plusieurs notifications comme lues
   * @param ids - Array des IDs des notifications
   * @returns Observable<ApiResponse<void>>
   */
  markMultipleAsRead(ids: string[]): Observable<ApiResponse<void>> {
    return this.apiService.patch<void>(`${this.endpoint}/bulk/read`, { ids });
  }

  /**
   * Marque toutes les notifications comme lues
   * @param userId - ID de l'utilisateur (optionnel)
   * @returns Observable<ApiResponse<void>>
   */
  markAllAsRead(userId?: string): Observable<ApiResponse<void>> {
    const body = userId ? { userId } : {};
    return this.apiService.patch<void>(`${this.endpoint}/read-all`, body);
  }

  /**
   * Supprime une notification
   * @param id - ID de la notification
   * @returns Observable<ApiResponse<void>>
   */
  deleteNotification(id: string): Observable<ApiResponse<void>> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // ============================================
  // MÉTHODES SPÉCIALISÉES
  // ============================================

  /**
   * Récupère les notifications non lues
   * @param userId - ID de l'utilisateur
   * @returns Observable<ApiResponse<Notification[]>>
   */
  getUnreadNotifications(userId?: string): Observable<ApiResponse<Notification[]>> {
    let params = new HttpParams().set('isRead', 'false');
    if (userId) params = params.set('userId', userId);
    
    return this.apiService.get<Notification[]>(this.endpoint, params);
  }

  /**
   * Récupère les statistiques des notifications
   * @param userId - ID de l'utilisateur
   * @returns Observable<ApiResponse<NotificationStats>>
   */
  getNotificationStats(userId?: string): Observable<ApiResponse<NotificationStats>> {
    let params = new HttpParams();
    if (userId) params = params.set('userId', userId);
    
    return this.apiService.get<NotificationStats>(`${this.endpoint}/stats`, params);
  }

  /**
   * Récupère les notifications récentes
   * @param limit - Nombre de notifications à récupérer
   * @param userId - ID de l'utilisateur
   * @returns Observable<ApiResponse<Notification[]>>
   */
  getRecentNotifications(limit: number = 10, userId?: string): Observable<ApiResponse<Notification[]>> {
    let params = new HttpParams().set('limit', limit.toString());
    if (userId) params = params.set('userId', userId);
    
    return this.apiService.get<Notification[]>(`${this.endpoint}/recent`, params);
  }

  // ============================================
  // MÉTHODES D'ÉTAT LOCAL
  // ============================================

  /**
   * Charge les notifications et met à jour l'état local
   */
  private loadNotifications(): void {
    this.getRecentNotifications(50).subscribe({
      next: (response) => {
        if (response.data) {
          this.notificationsSubject.next(response.data);
          this.updateUnreadCount(response.data);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des notifications:', error);
      }
    });
  }

  /**
   * Met à jour le compteur de notifications non lues
   * @param notifications - Liste des notifications
   */
  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }

  /**
   * Ajoute une nouvelle notification à l'état local
   * @param notification - Nouvelle notification
   */
  public addNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [notification, ...currentNotifications];
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
  }

  /**
   * Met à jour une notification dans l'état local
   * @param updatedNotification - Notification mise à jour
   */
  public updateNotificationInState(updatedNotification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n => 
      n.id === updatedNotification.id ? updatedNotification : n
    );
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
  }

  /**
   * Supprime une notification de l'état local
   * @param notificationId - ID de la notification à supprimer
   */
  public removeNotificationFromState(notificationId: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== notificationId);
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);
  }

  /**
   * Marque une notification comme lue dans l'état local et sur le serveur
   * @param notificationId - ID de la notification
   */
  public markNotificationAsRead(notificationId: string): void {
    // Mise à jour locale immédiate
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount(updatedNotifications);

    // Synchronisation avec le serveur
    this.markAsRead(notificationId).subscribe({
      next: (response) => {
        console.log('Notification marquée comme lue:', response);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de la notification:', error);
        // En cas d'erreur, remettre l'état précédent
        this.notificationsSubject.next(currentNotifications);
        this.updateUnreadCount(currentNotifications);
      }
    });
  }

  /**
   * Obtient le nombre de notifications non lues
   * @returns Nombre de notifications non lues
   */
  public getUnreadCount(): number {
    return this.unreadCountSubject.value;
  }

  /**
   * Obtient les notifications actuelles
   * @returns Array des notifications
   */
  public getCurrentNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  /**
   * Filtre les notifications par type
   * @param type - Type de notification
   * @returns Notifications filtrées
   */
  public getNotificationsByType(type: Notification['type']): Notification[] {
    return this.getCurrentNotifications().filter(n => n.type === type);
  }

  /**
   * Filtre les notifications par priorité
   * @param priority - Priorité
   * @returns Notifications filtrées
   */
  public getNotificationsByPriority(priority: Notification['priority']): Notification[] {
    return this.getCurrentNotifications().filter(n => n.priority === priority);
  }

  /**
   * Actualise les notifications depuis le serveur
   */
  public refreshNotifications(): void {
    this.loadNotifications();
  }
}
