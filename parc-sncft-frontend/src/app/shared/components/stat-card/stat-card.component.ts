import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [class]="'stat-' + variant">
      <div class="stat-header">
        <div class="stat-icon">
          <ng-content select="[slot=icon]"></ng-content>
        </div>
        <div class="stat-trend" *ngIf="trend" [class]="'trend-' + trend.type">
          <div class="trend-icon" [innerHTML]="getTrendIcon()"></div>
          <span class="trend-value">{{trend.value}}%</span>
        </div>
      </div>
      
      <div class="stat-content">
        <div class="stat-value" [style.color]="getValueColor()">
          <span class="stat-number">{{value}}</span>
          <span class="stat-unit" *ngIf="unit">{{unit}}</span>
        </div>
        
        <div class="stat-info">
          <h3 class="stat-title">{{title}}</h3>
          <p class="stat-subtitle" *ngIf="subtitle">{{subtitle}}</p>
        </div>
      </div>
      
      <div class="stat-footer" *ngIf="footerText">
        <span class="footer-text">{{footerText}}</span>
      </div>
      
      <div class="stat-progress" *ngIf="progress !== undefined">
        <div class="progress-bar" [style.width.%]="progress" [style.background]="getProgressColor()"></div>
      </div>
    </div>
  `,
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() value!: string | number;
  @Input() unit?: string;
  @Input() icon!: string;
  @Input() variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' = 'primary';
  @Input() trend?: { type: 'up' | 'down' | 'neutral'; value: number };
  @Input() footerText?: string;
  @Input() progress?: number; // 0-100

  getIconBackground(): string {
    const colors = {
      primary: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(96, 165, 250, 0.1))',
      secondary: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(251, 146, 60, 0.1))',
      success: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1))',
      warning: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(251, 146, 60, 0.1))',
      danger: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.1))',
      info: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(96, 165, 250, 0.1))'
    };
    return colors[this.variant];
  }

  getValueColor(): string {
    const colors = {
      primary: '#2563eb',
      secondary: '#f97316',
      success: '#10b981',
      warning: '#f97316',
      danger: '#ef4444',
      info: '#2563eb'
    };
    return colors[this.variant];
  }

  getProgressColor(): string {
    return this.getValueColor();
  }

  getTrendIcon(): string {
    if (!this.trend) return '';
    
    switch (this.trend.type) {
      case 'up': 
        return `<svg viewBox="0 0 24 24" fill="#10b981" style="width: 16px; height: 16px;">
                  <path d="M7 14l5-5 5 5H7z"/>
                </svg>`;
      case 'down': 
        return `<svg viewBox="0 0 24 24" fill="#ef4444" style="width: 16px; height: 16px;">
                  <path d="M7 10l5 5 5-5H7z"/>
                </svg>`;
      case 'neutral': 
        return `<svg viewBox="0 0 24 24" fill="#6b7280" style="width: 16px; height: 16px;">
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L12.17 11H4v2h8.17l-3.58 3.59z"/>
                </svg>`;
      default: return '';
    }
  }
}
