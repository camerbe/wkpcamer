import { Pipe, PipeTransform, inject } from '@angular/core';
import { SlugifyService } from '../services/slugify.service';

@Pipe({
  name: 'slugify',
  standalone: true,
  pure: true
})
export class SlugifyPipe implements PipeTransform {
  private slugifyService = inject(SlugifyService);

  transform(value: string): string {
    return this.slugifyService.slugify(value);
  }
}
