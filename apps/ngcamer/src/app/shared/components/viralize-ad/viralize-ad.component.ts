import { AfterViewInit, Component, ElementRef, inject, Input, OnDestroy, OnInit, PLATFORM_ID, Renderer2, signal, ViewChild } from '@angular/core';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { isPlatformBrowser } from '@angular/common';

declare let Viralize: any;
@Component({
  selector: 'app-viralize-ad',
  imports: [],
  template: '<div #adContainer></div>',
  styleUrl: './viralize-ad.component.css'
})
export class ViralizeAdComponent implements  AfterViewInit, OnDestroy {
  @Input() zid!: string;

  @ViewChild('adContainer', { static: true }) scriptContainer!: ElementRef;
  isBrowser=signal(false);

  renderer=inject(Renderer2);
  platformId=inject(PLATFORM_ID);

  /**
   *
   */
  constructor() {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    
  }
  ngOnDestroy(): void {
    if(this.isBrowser()){
      this.scriptContainer.nativeElement.innerHTML = '';
    }
  }
  ngAfterViewInit(): void {
   if(this.isBrowser()){
    this.injectViralizeScript();
   }
  }
  injectViralizeScript() {
    const parentElement = this.scriptContainer.nativeElement;
    parentElement.innerHTML = '';
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'data-wid', 'auto');
    this.renderer.setAttribute(script, 'type', 'text/javascript');

    const scriptSrc = `https://ads.viralize.tv/display/?zid=${this.zid}`;
    this.renderer.setAttribute(script, 'src', scriptSrc);
    this.renderer.appendChild(parentElement, script);
  }
  

}
