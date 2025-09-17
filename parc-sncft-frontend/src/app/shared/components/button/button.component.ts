import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type"
      [disabled]="disabled || loading"
      [class]="getButtonClasses()"
      (click)="handleClick($event)">
      
      <span class="btn-icon" *ngIf="icon && !loading">{{icon}}</span>
      <span class="btn-loader" *ngIf="loading">⏳</span>
      
      <span class="btn-text" *ngIf="!iconOnly">
        <ng-content></ng-content>
      </span>
      
      <span class="btn-icon-end" *ngIf="iconEnd && !loading">{{iconEnd}}</span>
    </button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon?: string;
  @Input() iconEnd?: string;
  @Input() iconOnly = false;
  @Input() fullWidth = false;
  @Input() rounded = false;

  handleClick(event: Event) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  getButtonClasses(): string {
    const classes = ['modern-btn'];
    
    classes.push(`btn-${this.variant}`);
    classes.push(`btn-${this.size}`);
    
    if (this.iconOnly) classes.push('btn-icon-only');
    if (this.fullWidth) classes.push('btn-full-width');
    if (this.rounded) classes.push('btn-rounded');
    if (this.loading) classes.push('btn-loading');
    if (this.disabled) classes.push('btn-disabled');
    
    return classes.join(' ');
  }
}
