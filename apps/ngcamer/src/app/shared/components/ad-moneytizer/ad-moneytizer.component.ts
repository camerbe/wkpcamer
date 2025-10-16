import { Component, ElementRef, inject, Input, OnDestroy, OnInit, PLATFORM_ID, Renderer2, signal, ViewChild } from '@angular/core';
import { AdScriptService } from '../../services/ad-script.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-ad-moneytizer',
  imports: [],
  templateUrl: './ad-moneytizer.component.html',
  styleUrl: './ad-moneytizer.component.css'
})
export class AdMoneytizerComponent implements OnInit,OnDestroy {

  @Input() appId!: string;
  @Input() zoneId!: string;

  @ViewChild('adContainer', { static: true }) adContainer!: ElementRef;
  isBrowser=signal(false);

  platformId = inject(PLATFORM_ID);
  renderer = inject(Renderer2);


  ngOnDestroy(): void {
    console.log('');
  }
  ngOnInit(): void {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
    if(this.isBrowser()){
       this.injectMoneytizerScripts();
    }
  }
  injectMoneytizerScripts() {
    const parentElement = this.adContainer.nativeElement;
    parentElement.innerHTML = '';
    const script1 = this.renderer.createElement('script');
    this.renderer.setAttribute(script1, 'src', '//ads.themoneytizer.com/s/gen.js?type=' + this.zoneId);
    this.renderer.setAttribute(script1, 'async', 'true');
    this.renderer.appendChild(parentElement, script1);
    const script2 = this.renderer.createElement('script');
    this.renderer.setAttribute(script2, 'src',
      `//ads.themoneytizer.com/s/requestform.js?siteId=${this.appId}&formatId=${this.zoneId}`
    );
    this.renderer.setAttribute(script2, 'async', 'true');
    this.renderer.appendChild(parentElement, script2);
  }

}
