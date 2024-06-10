import PocketBase from "pocketbase";

// Define interfaces for the data structures
export type Asset = {
  alias: string;
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  img: string;
  src: string;
  updated: string;
};

export type Bundle = {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  name: string;
  updated: string;
  assets: string[];
  expand: {
    assets: Asset[];
  };
};

export type AssetRecord = {
  alias: string;
  imgUrl: string;
  src: string;
};

export type BundleRecord = {
  name: string;
  assets: AssetRecord[];
};

const pb = new PocketBase(import.meta.env.VITE_BASE_URL);
const adminToken = import.meta.env.VITE_POCKETBASE_ADMIN_TOKEN;

async function fetchGameRecords(): Promise<BundleRecord[]> {
  try {
    const records = await pb.collection("bundles").getFullList({
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      expand: "assets",
    });

    // Map the records to the Bundle type
    const bundles: BundleRecord[] = records.map((record: any) => ({
      name: record.name,
      assets: record.expand.assets.map((asset: any) => ({
        alias: asset.alias,
        imgUrl: asset.img
          ? `${pb.baseUrl}/api/files/${asset.collectionId}/${asset.id}/${asset.img}`
          : "",
        src: asset.src,
      })),
    }));

    console.log(bundles);
    return bundles;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export { fetchGameRecords };
