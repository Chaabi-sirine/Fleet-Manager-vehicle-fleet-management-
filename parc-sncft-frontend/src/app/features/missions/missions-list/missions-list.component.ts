import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionsService } from 'src/app/core/services/missions.service';
import { Mission } from 'src/app/core/models/mission.model';

@Component({
  selector: 'app-missions-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './missions-list.component.html',
  styleUrls: ['./missions-list.component.scss']
})
export class MissionsListComponent implements OnInit {
  showModal: boolean = false;
  missions: Mission[] = [];

  selectedMission: Mission | null = null;

  constructor(private missionsService: MissionsService) {}

  ngOnInit(): void {
    this.missionsService.getMissions().subscribe((data: Mission[]) => {
      this.missions = data;
      console.log(this.missions);
    });
  }

  showDetails(mission: Mission): void {
    this.selectedMission = mission;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedMission = null;
  }
}
