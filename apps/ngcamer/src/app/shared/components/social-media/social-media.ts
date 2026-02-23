import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardModule } from "primeng/card";

@Component({
  selector: 'app-social-media',
  imports: [CardModule],
  templateUrl: './social-media.html',
  styleUrl: './social-media.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialMedia {

}
