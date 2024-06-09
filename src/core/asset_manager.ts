import * as PIXI from "pixi.js";
import { AssetRecord, BundleRecord } from "../api/api";

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

  async loadAsset(
    bundleName: string,
    assetAlias: string,
  ): Promise<PIXI.Texture> {
    if (!this.manifest) {
      throw new Error("Manifest not loaded");
    }

    await PIXI.Assets.load(bundleName);

    const bundle = this.manifest.bundles.find((b) => b.name === bundleName);
    if (!bundle) {
      throw new Error(`Bundle ${bundleName} not found`);
    }

    const asset = (bundle.assets as AssetRecord[]).find(
      (a: AssetRecord) => a.alias === assetAlias,
    );
    if (!asset) {
      throw new Error(`Asset ${assetAlias} not found in bundle ${bundleName}`);
    }

    return PIXI.Assets.get(asset.alias);
  }

  async unloadBundle(bundleName: string): Promise<void> {
    await PIXI.Assets.unloadBundle(bundleName);
  }
}

export const assetManager = new AssetManager();
