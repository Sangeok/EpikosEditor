import { Media } from "@/entities/media/types";
import { ProjectType } from "@/entities/project/types";
import { CreateVideoType } from "@/entities/mediaAsset/types";

export interface SavedProject {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  projectData: ProjectType;
  mediaData: Media;
  createVideoData: CreateVideoType;
  timelineData?: {
    currentTime: number;
    zoom: number;
  };
  // Persist session-volatile blobs (e.g., audio/tts) so we can recreate object URLs on load
  blobData?: {
    tts?: Blob | null;
    audio?: Record<string, Blob>;
  };
}

class IndexedDBService {
  private dbName = "VideoEditorDB";
  private version = 1;
  private db: IDBDatabase | null = null;

  async openDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      // check if indexedDB is supported
      if (!window.indexedDB) {
        reject(new Error("IndexedDB is not supported by this browser"));
        return;
      }

      // open database
      const request = indexedDB.open(this.dbName, this.version);

      // Register handler
      // handle error
      request.onerror = () => {
        const error = request.error || new Error("Failed to open database");
        console.error("IndexedDB open error:", error);
        reject(error);
      };

      // handle success
      request.onsuccess = () => {
        this.db = request.result;

        // Add error handler for the database
        this.db.onerror = (event) => {
          console.error("Database error:", event);
        };

        resolve(request.result);
      };

      // handle upgrade(or create for first time)
      request.onupgradeneeded = (event) => {
        try {
          const db = (event.target as IDBOpenDBRequest).result;

          // Create projects store
          if (!db.objectStoreNames.contains("projects")) {
            const projectStore = db.createObjectStore("projects", {
              keyPath: "id",
            });
            projectStore.createIndex("name", "name", { unique: false });
            projectStore.createIndex("updatedAt", "updatedAt", {
              unique: false,
            });
          }
        } catch (error) {
          console.error("Database upgrade error:", error);
          reject(error);
        }
      };

      request.onblocked = () => {
        console.warn("Database upgrade blocked. Please close other tabs with this application.");
      };
    });
  }

  async saveProject(projectData: SavedProject): Promise<void> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["projects"], "readwrite");
      // Access the object store(projects table)
      const store = transaction.objectStore("projects");

      const request = store.put({
        ...projectData,
        updatedAt: new Date(),
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async loadProject(projectId: string): Promise<SavedProject | null> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["projects"], "readonly");
      const store = transaction.objectStore("projects");

      const request = store.get(projectId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Convert date strings back to Date objects
          result.createdAt = new Date(result.createdAt);
          result.updatedAt = new Date(result.updatedAt);
          result.projectData.createdAt = new Date(result.projectData.createdAt);
          result.projectData.updatedAt = new Date(result.projectData.updatedAt);
        }
        resolve(result || null);
      };
    });
  }

  async getAllProjects(): Promise<SavedProject[]> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["projects"], "readonly");
      const store = transaction.objectStore("projects");
      const index = store.index("updatedAt");
      const request = index.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const results = request.result || [];
        // Convert date strings back to Date objects and sort by updatedAt desc
        const projects = results
          .map((result) => ({
            ...result,
            createdAt: new Date(result.createdAt),
            updatedAt: new Date(result.updatedAt),
            projectData: {
              ...result.projectData,
              createdAt: new Date(result.projectData.createdAt),
              updatedAt: new Date(result.projectData.updatedAt),
            },
          }))
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        resolve(projects);
      };
    });
  }

  async deleteProject(projectId: string): Promise<void> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["projects"], "readwrite");
      const store = transaction.objectStore("projects");
      const request = store.delete(projectId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clearAllProjects(): Promise<void> {
    const db = await this.openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["projects"], "readwrite");
      const store = transaction.objectStore("projects");
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const indexedDBService = new IndexedDBService();
