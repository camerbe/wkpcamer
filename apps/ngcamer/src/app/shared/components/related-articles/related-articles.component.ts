import { ButtonModule } from 'primeng/button';
import { ChangeDetectionStrategy, Component, computed, inject, input, Input, OnInit, signal } from '@angular/core';
import { ArticleDetail } from '@wkpcamer/models';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SlugifyService } from '../../services/slugify.service';

interface ResponsiveOption {
  breakpoint: string;
  numVisible: number;
  numScroll: number;
}

interface ArticleViewModel {
  article: ArticleDetail;
  navigationPath: string;
  imageAlt: string;
  imageTitle: string;
  imageWidth: number;
  imageHeight: number;
}
@Component({
  selector: 'app-related-articles',
  imports: [
    CardModule,
    ButtonModule,
    CarouselModule,
    TagModule,
    DividerModule,
    CommonModule,
    NgOptimizedImage,
    RouterModule
],
  templateUrl: './related-articles.component.html',
  styleUrl: './related-articles.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelatedArticlesComponent {


  relatedArticles = input.required<ArticleDetail[]>();

  // Computed signal pour transformer les données
  articleViewModels = computed(() => {
    return this.relatedArticles().map(article => ({
      article,
      navigationPath: `/${this.slugifyService.slugify(article.rubrique.rubrique)}/${this.slugifyService.slugify(article.sousrubrique.sousrubrique)}/${article.slug}`,
      imageAlt: `${article.countries.pays} :: ${article.titre}`,
      imageTitle: `${article.countries.pays} :: ${article.titre}`,
      imageWidth: article.image_width || 500,
      imageHeight: article.image_height || 500
    }));
  });
 // readonly relatedArticles$ = this.relatedArticlesSignal.asReadonly();

  responsiveOptions : ResponsiveOption[] = [
    {
      breakpoint: '1024px',  // tablettes/petits laptops
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '768px',   // mobiles en mode paysage
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '560px',   // petits mobiles
      numVisible: 1,
      numScroll: 1
    }
  ];


  // *************** INJECTION  ****************
  private slugifyService=inject(SlugifyService);
  private router=inject(Router);

  protected async gotoArticle(navigationPath: string) {

    try {
    // Normaliser le chemin (enlever le "/" initial si présent)
    const cleanPath = navigationPath.startsWith('/')
      ? navigationPath.slice(1)
      : navigationPath;

    // Navigation optimisée avec skipLocationChange
    await this.router.navigateByUrl('/', { skipLocationChange: true });
    await this.router.navigate([`/${cleanPath}`]);
    } catch (error) {
      console.error('Navigation error:', error);
      // Optionnel : gestion d'erreur avec fallback
      // this.router.navigate(['/error']);
    }
  }
  // ngOnInit(): void {
  //   throw new Error('Method not implemented.');
  // }
  protected trackByArticleId(_index: number, vm: ArticleViewModel): string {
    return vm.article.slug || _index.toString();
  }

  trackByTag(_index: number, tag: string): string {
    return tag;
  }
}
