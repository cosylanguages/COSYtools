#!/usr/bin/env node
/**
 * scripts/generate-app-sources.js
 *
 * Derives the master native source images from brand art already in the repo:
 *   native/capacitor/assets/icon.png   1024x1024, from shared/images/cosylanguages.png
 *   native/capacitor/assets/splash.png 2732x2732, brand background + centred logo
 *   native/electron/build/icon.png     512x512,  consumed by electron-builder
 *
 * These feed the official Capacitor asset generator (`npx capacitor-assets
 * generate`) and the Electron packager. Run once, or whenever brand art changes.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const LOGO = path.join(ROOT, 'shared', 'images', 'cosylanguages.png');
const CAP_ASSETS = path.join(ROOT, 'native', 'capacitor', 'assets');
const ELECTRON_BUILD = path.join(ROOT, 'native', 'electron', 'build');

const ICON_SIZE = 1024;
const SPLASH_SIZE = 2732;
const LOGO_ON_SPLASH = 900;
const BRAND_BG = '#416b49';
const BRAND_BG_DARK = '#1c2a1f';

async function main() {
  if (!fs.existsSync(LOGO)) {
    console.error(`Missing source logo: ${LOGO}`);
    process.exit(1);
  }
  fs.mkdirSync(CAP_ASSETS, { recursive: true });
  fs.mkdirSync(ELECTRON_BUILD, { recursive: true });

  await sharp(LOGO).resize(ICON_SIZE, ICON_SIZE, { fit: 'cover' }).png()
    .toFile(path.join(CAP_ASSETS, 'icon.png'));

  const logo = await sharp(LOGO)
    .resize(LOGO_ON_SPLASH, LOGO_ON_SPLASH, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  for (const [name, bg] of [['splash.png', BRAND_BG], ['splash-dark.png', BRAND_BG_DARK]]) {
    await sharp({ create: { width: SPLASH_SIZE, height: SPLASH_SIZE, channels: 4, background: bg } })
      .composite([{ input: logo, gravity: 'centre' }])
      .png()
      .toFile(path.join(CAP_ASSETS, name));
  }

  await sharp(LOGO).resize(512, 512, { fit: 'cover' }).png()
    .toFile(path.join(ELECTRON_BUILD, 'icon.png'));

  console.log('Wrote native/capacitor/assets/{icon,splash,splash-dark}.png and native/electron/build/icon.png.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
