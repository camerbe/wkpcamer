import { ButtonModule } from 'primeng/button';
import { Component, Input, signal } from '@angular/core';
import { ArticleDetail } from '@wkpcamer/models';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-related-articles',
  imports: [
    CardModule,
    ButtonModule,
    CarouselModule,
    TagModule,
    DividerModule
  ],
  templateUrl: './related-articles.component.html',
  styleUrl: './related-articles.component.css'
})
export class RelatedArticlesComponent {
  @Input () relatedArticles: ArticleDetail[] = [];
}
