// Define interfaces for the data structures
interface Asset {
  alias: string;
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  img: string;
  src: string;
  updated: string;
}

interface Bundle {
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
}

interface ApiResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: Bundle[];
}

const apiUrl =
  import.meta.env.VITE_POCKETBASE_API_URL + "/collections/bundles/records";
const adminToken = import.meta.env.VITE_POCKETBASE_ADMIN_TOKEN;
const baseUrl = import.meta.env.VITE_BASE_URL;

async function fetchGameRecords() {
  try {
    const response = await fetch(`${apiUrl}?expand=assets`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();

    // Process the data to get the image URLs
    const bundles = data.items.map((bundle) => {
      const assets = bundle.expand.assets.map((asset) => {
        let imgUrl = asset.img;

        // Construct the full URL for local images
        if (imgUrl) {
          imgUrl = `${baseUrl}/api/files/${asset.collectionId}/${asset.id}/${imgUrl}`;
        }

        return {
          alias: asset.alias,
          imgUrl: imgUrl,
          src: asset.src,
        };
      });

      return {
        id: bundle.id,
        name: bundle.name,
        assets: assets,
      };
    });

    console.log(bundles);
    return bundles;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export { fetchGameRecords };
