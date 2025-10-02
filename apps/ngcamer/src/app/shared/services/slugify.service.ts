import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlugifyService {
  slugify(text: string): string {
    if (!text) {
      return '';
    }
    return text
      .toString()
      .toLowerCase()
      .trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/[^\w-]+/g, '')     // Remove all non-word chars
      .replace(/--+/g, '-')        // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');
  }    // Replace spaces with -
}
