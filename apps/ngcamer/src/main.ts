import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { getPlatform, destroyPlatform } from '@angular/core';

const platform = getPlatform();
if (platform) {
  destroyPlatform();
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
