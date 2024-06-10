import * as PIXI from "pixi.js";
import { AssetRecord, BundleRecord } from "../api/bundle_config_api";

export class AssetManager {
  private manifest: PIXI.AssetsManifest | null = null;

  async loadManifest(records: BundleRecord[]): Promise<void> {
    this.manifest = {
      bundles: records.map((bundle: BundleRecord) => ({
        name: bundle.name,
        assets: bundle.assets.map((asset: AssetRecord) => ({
          alias: asset.alias,
          src: asset.imgUrl || asset.src,
        })),
      })),
    };

    await PIXI.Assets.init({ manifest: this.manifest });
    await PIXI.Assets.backgroundLoadBundle(
      this.manifest.bundles.map((bundle) => bundle.name),
    );
  }

  getManifest(): PIXI.AssetsManifest | null {
    return this.manifest;
  }

  getBundleNames(): string[] {
    if (!this.manifest) {
      return [];
    }
    return this.manifest.bundles.map((bundle) => bundle.name);
  }

  async unloadBundle(bundleName: string): Promise<void> {
    await PIXI.Assets.unloadBundle(bundleName);
  }
}

export const assetManager = new AssetManager();
