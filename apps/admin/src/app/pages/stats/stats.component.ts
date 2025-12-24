import { ActivatedRoute } from '@angular/router';
import { StatsService } from '@wkpcamer/actions';
import { Component, inject, OnInit } from '@angular/core';
import { Stats } from '@wkpcamer/models';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { IsExpiredService } from '@wkpcamer/shared';

@Component({
  selector: 'admin-stats',
  imports: [
    CardModule,PanelModule
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
})
export class StatsComponent implements OnInit{
  stats:Stats= {
      total_admins: 0,
      published_today: 0,
      scheduled: 0
    };
  statistique={admins:0,schedule:0,published:0};


  isExpiredService=inject(IsExpiredService)
  statsService=inject(StatsService)
  activatedRoute=inject(ActivatedRoute);
  ngOnInit(): void {
    if(this.isExpiredService.isExpired()) this.isExpiredService.logout();
    this.activatedRoute.data.subscribe({
      next:(data)=>{
        this.stats=data["statistique"] as Stats;
      }
    });
    // this.statsService.getStats().subscribe({
    //   next:(data:Stats)=>{
    //     this.stats = data;

    //   }
    // });
  }
}
