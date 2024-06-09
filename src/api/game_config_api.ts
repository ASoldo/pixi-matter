import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_BASE_URL);
const adminToken = import.meta.env.VITE_POCKETBASE_ADMIN_TOKEN;

// Define the Scene and GameConfig interfaces
export interface Scene {
  id: string;
  name: string;
  description: string;
  asset_bundle: string;
  scene: string;
}

export interface GameConfig {
  id: string;
  loop_name: string;
  loop: boolean;
  scenes: Scene[];
  loop_schedule: boolean;
  start_loop: string;
  end_loop: string;
}

async function fetchGameConfig(): Promise<GameConfig[]> {
  try {
    const records = await pb.collection("game_config").getFullList({
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      expand: "scenes",
    });

    // Map the records to the GameConfig type
    const gameConfigs: GameConfig[] = records.map((record: any) => ({
      id: record.id,
      loop_name: record.loop_name,
      loop: record.loop,
      scenes: record.expand.scenes.map((scene: any) => ({
        id: scene.id,
        name: scene.name,
        description: scene.description,
        asset_bundle: scene.asset_bundle,
        scene: scene.scene,
      })),
      loop_schedule: record.loop_schedule,
      start_loop: record.start_loop,
      end_loop: record.end_loop,
    }));

    return gameConfigs;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export { fetchGameConfig };
