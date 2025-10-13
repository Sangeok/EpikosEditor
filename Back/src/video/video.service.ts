// video.service.ts
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { bundle } from '@remotion/bundler';
import {
  makeCancelSignal,
  renderMedia,
  selectComposition,
} from '@remotion/renderer';
import * as path from 'path';
import type { VideoInputData } from '../types';
import { VideoGateway } from './video.gateway';

@Injectable()
export class VideoService {
  private activeJobs = new Map<string, () => void>(); // save cancel function by jobId

  constructor(
    @Inject(forwardRef(() => VideoGateway))
    private readonly videoGateway: VideoGateway,
  ) {}

  async createVideo(
    inputData: VideoInputData,
    jobId?: string,
  ): Promise<string> {
    try {
      const { cancelSignal, cancel } = makeCancelSignal();

      // if jobId exists, save cancel function
      if (jobId) {
        this.activeJobs.set(jobId, cancel);
        console.log(`job started - JobID: ${jobId}`);
      }

      console.log('VideoService createVideo started');
      console.log('input data:', JSON.stringify(inputData, null, 2));

      // 1. Remotion project bundling
      console.log('bundling started...');
      const bundleLocation = await bundle({
        entryPoint: path.resolve(__dirname, '../remotion/index.js'),
        webpackOverride: (config) => config,
      });
      console.log('bundling completed:', bundleLocation);

      // 2. select composition
      console.log('select composition started...');
      const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: 'MyComposition',
        inputProps: inputData,
      });
      console.log('composition info:', composition);

      // 3. render video
      const outputPath = path.resolve(
        __dirname,
        `../../uploads/video-${Date.now()}.mp4`,
      );

      console.log('video rendering started...', outputPath);
      console.log('rendering settings:', {
        duration: composition.durationInFrames,
        fps: composition.fps,
        width: composition.width,
        height: composition.height,
      });

      await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: outputPath,
        inputProps: inputData,
        cancelSignal,
        onProgress: ({ progress }) => {
          console.log(`rendering progress: ${(progress * 100).toFixed(1)}%`);
          if (jobId) {
            this.videoGateway.sendProgress(jobId, progress);
          }
        },
      });

      console.log('video rendering completed:', outputPath);

      // clean up when job is completed
      if (jobId) {
        this.activeJobs.delete(jobId);
      }

      return outputPath;
    } catch (error) {
      // clean up when error occurs
      if (jobId) {
        this.activeJobs.delete(jobId);
      }

      throw new Error(
        `video creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * cancel running job(rendering video)
   */
  cancelJob(jobId: string): boolean {
    const cancelFunction = this.activeJobs.get(jobId);
    if (cancelFunction) {
      console.log(`cancel job request: ${jobId}`);
      cancelFunction();
      this.activeJobs.delete(jobId);
      this.videoGateway.sendCancelled(jobId);
      return true;
    }
    console.log(`Can't find job: ${jobId}`);
    return false;
  }
}
