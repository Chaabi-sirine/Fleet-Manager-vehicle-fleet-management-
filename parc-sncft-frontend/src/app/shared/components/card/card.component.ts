import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modern-card" [class.hover-effect]="hoverEffect" [class.bordered]="bordered">
      <div class="card-header" *ngIf="title || hasHeaderContent">
        <div class="card-title-section">
          <div class="card-icon" *ngIf="icon">
            {{icon}}
          </div>
          <div class="card-title-content">
            <h3 class="card-title" *ngIf="title">{{title}}</h3>
            <p class="card-subtitle" *ngIf="subtitle">{{subtitle}}</p>
          </div>
        </div>
        <div class="card-actions">
          <ng-content select="[slot=actions]"></ng-content>
        </div>
      </div>
      
      <div class="card-body" [style.padding]="noPadding ? '0' : null">
        <ng-content></ng-content>
      </div>
      
      <div class="card-footer" *ngIf="hasFooterContent">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() hoverEffect: boolean = true;
  @Input() bordered: boolean = true;
  @Input() noPadding: boolean = false;

  hasHeaderContent = false;
  hasFooterContent = false;

  ngAfterContentInit() {
    // Check if there's content in header/footer slots
    this.hasHeaderContent = true; // Simplified for now
    this.hasFooterContent = true; // Simplified for now
  }
}
