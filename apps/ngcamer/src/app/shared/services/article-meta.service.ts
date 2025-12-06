import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ArticleDetail } from '@wkpcamer/models';

@Injectable({
  providedIn: 'root'
})
export class ArticleMetaService {
  meta=inject(Meta);
  title=inject(Title);
  router=inject(Router);
  isBrowser=signal(false);
  platformId = inject(PLATFORM_ID);

  updateArticleMeta(article:ArticleDetail){
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(!this.isBrowser()) return;
    const date = new Date().toISOString().slice(0, 19) + '+00:00';
    const articleDate = new Date(article.dateparution).toISOString().slice(0, 19) + '+00:00';
    //const titre=this.appendCountryIfFound(article.titre,article.countries.country)+' - Camer.be';
    const titre=ArticleMetaService.getTitle(article.countries.pays,article.titre,article.countries.country,)+' - Camer.be';
    this.title.setTitle(titre);

    this.meta.updateTag({
      name:'description',
      content:article.chapeau
    });
    this.meta.updateTag({ name: 'keywords', content: article.keyword });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'article:modified_time', content: date });
    this.meta.updateTag({ name: 'article:published_time', content: articleDate });
    this.meta.updateTag({ name: 'article:section', content: article.sousrubrique.sousrubrique });
    this.meta.updateTag({ name: 'article:author', content: article.auteur });
    this.meta.updateTag({ name: 'article:publisher', content: article.source });
    this.updateOpenGraphTags(article)
  }
  private appendCountryIfFound(title: string, country: string): string {
      if (!title.toLowerCase().includes(country.toLowerCase())) {
        return `${country} :: ${title} `;
      }
      return title;
  }
  private static getTitle(pays: string, titre: string, country: string): string {
    // On convertit tout en lowercase pour la comparaison, comme stripos en PHP
    const titreLower = titre.toLowerCase();
    const paysLower = pays.toLowerCase();
    const countryLower = country.toLowerCase();

    if (pays === country) {
      return titreLower.includes(paysLower) ? titre : `${pays} :: ${titre}`;
    }

    const hasPays = titreLower.includes(paysLower);
    const hasCountry = titreLower.includes(countryLower);

    if (hasPays) {
      return `${titre} :: ${country}`;
    }

    if (hasCountry) {
      return `${pays} :: ${titre}`;
    }

    return `${pays} :: ${titre} :: ${country}`;
  }
  private updateOpenGraphTags(article:ArticleDetail){



    this.meta.updateTag({ name: 'og:title', content: article.titre });
    this.meta.updateTag({ name: 'og:description', content: article.chapeau });
    this.meta.updateTag({ name: 'og:image', content: article.image_url });
    this.meta.updateTag({ name: 'og:image:alt', content:  article.titre });
    this.meta.updateTag({ name: 'og:image:width', content: article.image_width });
    this.meta.updateTag({ name: 'og:image:height', content: article.image_height });
    this.meta.updateTag({ name: 'og:url', content: `${window.location.protocol}//${window.location.host}${this.router.url}` });
    this.meta.updateTag({ name: 'og:type', content: 'article' });
    this.meta.updateTag({ name: 'og:locale', content: 'fr_FR' });
    this.meta.updateTag({ name: 'og:locale:alternate', content: 'en-us' });
    this.meta.updateTag({ name: 'og:site_name', content: 'Camer.be' });
    this.meta.updateTag({ name: 'twitter:title', content: article.titre.slice(0, 70) + '...' });
    this.meta.updateTag({ name: 'twitter:description', content: article.chapeau });
    this.meta.updateTag({ name: 'twitter:image', content: article.image_url });
    this.meta.updateTag({ name: 'twitter:image:alt', content: article.titre });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@camer.be'});
    this.meta.updateTag({ name: 'twitter:creator', content: '@camerbe' });
    this.meta.updateTag({ name: 'twitter:url', content: `${window.location.protocol}//${window.location.host}${this.router.url}` });

  }

}
