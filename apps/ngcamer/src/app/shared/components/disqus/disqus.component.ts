import { Component, OnChanges, Input, AfterViewInit, OnDestroy, SimpleChanges, ElementRef, inject } from '@angular/core';

declare global {
  interface Window {
    DISQUS: any;
    disqus_config: () => void;
  }
}

interface DisqusConfig {
  page: {
    identifier: string;
    url: string;
    title?: string;
  };
}

@Component({
  selector: 'app-disqus',
  standalone: true,
  imports: [


  ],
  template: `<div id="disqus_thread"></div>`,
  styleUrl: './disqus.component.css'
})
export class DisqusComponent implements AfterViewInit, OnChanges, OnDestroy {

   @Input() identifier!: string;
   @Input() url!: string;
   @Input() title!: string;

   observer?: IntersectionObserver;
   hasLoaded = false;


   el = inject(ElementRef);

   loadDisqus(reload = false): void {
    if (!this.identifier || !this.url) return;


    if (window.DISQUS && reload) {
      window.DISQUS.reset({
        reload: true,
        config:this.getConfig(this.identifier, this.url, this.title)

      });
       return;
    }
    if(!window.DISQUS) {
      window.disqus_config = () => this.getConfig(this.identifier, this.url, this.title);

      const d = document;
      const s = d.createElement('script');
      s.src = 'https://camer-be.disqus.com/embed.js'; //
      s.async = true;
      s.setAttribute('data-timestamp', String(new Date().getTime()));
      (d.head || d.body).appendChild(s);
      this.hasLoaded = true;
    }
  }

  getConfig(identifier: string, url: string, title?: string){
    return function (this: DisqusConfig) {
      this.page.identifier = identifier;
      this.page.url = url;
      this.page.title = title;
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.hasLoaded) return;
    if (changes['identifier'] || changes['url'] || changes['title']) {
      this.loadDisqus(true);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.loadDisqus();
        this.observer?.disconnect();
      }
    }, { rootMargin: '200px' });

    this.observer.observe(this.el.nativeElement);
  }

}
