/**
 * AssetUploadService
 * Handles uploading of blob/data URLs to backend and returns HTTP URLs
 */

export class AssetUploadService {
  /**
   * Upload a blob or data URL to the backend if needed
   * Returns the original URL if it's already an HTTP URL
   */
  static async uploadIfNeeded(url: string, apiBase: string, fallbackName: string): Promise<string> {
    if (!url) return url;

    const isHttpUrl = url.startsWith("http://") || url.startsWith("https://");
    if (isHttpUrl) return url;

    return await this.uploadBlobUrl(url, apiBase, fallbackName);
  }

  /**
   * Upload a blob URL to the backend
   */
  private static async uploadBlobUrl(blobUrl: string, apiBase: string, fallbackName: string): Promise<string> {
    const blob = await this.fetchBlob(blobUrl);
    const formData = this.createFormData(blob, fallbackName);
    const uploadedUrl = await this.postUpload(apiBase, formData);

    return uploadedUrl;
  }

  /**
   * Fetch blob from URL
   */
  private static async fetchBlob(url: string): Promise<Blob> {
    const response = await fetch(url);
    return await response.blob();
  }

  /**
   * Create FormData with file
   */
  private static createFormData(blob: Blob, filename: string): FormData {
    const form = new FormData();
    form.append("file", blob, filename);
    return form;
  }

  /**
   * Post upload to backend
   */
  private static async postUpload(apiBase: string, formData: FormData): Promise<string> {
    const response = await fetch(`${apiBase}/video/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Asset upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data.url as string;
  }

  // Resolve all media URLs for export and upload to backend
  static async resolveMediaForExport<
    T extends {
      mediaElement?: Array<{ url?: string; [key: string]: any }>;
      audioElement?: Array<{ url: string; [key: string]: any }>;
      [key: string]: any;
    }
  >(mediaData: T, apiBase: string): Promise<T> {
    const mediaElement = await this.resolveMediaElements(mediaData.mediaElement || [], apiBase);

    const audioElement = await this.resolveAudioElements(mediaData.audioElement || [], apiBase);

    return { ...mediaData, mediaElement, audioElement } as T;
  }

  /**
   * Resolve media element URLs
   */
  private static async resolveMediaElements(elements: Array<{ url?: string; [key: string]: any }>, apiBase: string) {
    return await Promise.all(
      elements.map(async (el, idx) => ({
        ...el,
        url: el.url ? await this.uploadIfNeeded(el.url, apiBase, `media-${idx}`) : el.url,
      }))
    );
  }

  /**
   * Resolve audio element URLs
   */
  private static async resolveAudioElements(elements: Array<{ url: string; [key: string]: any }>, apiBase: string) {
    return await Promise.all(
      elements.map(async (el, idx) => ({
        ...el,
        url: await this.uploadIfNeeded(el.url, apiBase, `audio-${idx}`),
      }))
    );
  }
}
