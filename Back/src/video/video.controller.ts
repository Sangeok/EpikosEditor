// video.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoGateway } from './video.gateway';
import type { VideoInputData } from '../types';

@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly videoGateway: VideoGateway,
  ) {}

  @Post('create')
  createVideo(@Body() videoData: VideoInputData) {
    try {
      const jobId = `job-${Date.now()}`;

      // create video in background
      void this.processVideoInBackground(jobId, videoData);

      return {
        success: true,
        jobId,
        message: 'video creation started',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // // 영상 다운로드
  // @Get('download/:filename')
  // downloadVideo(@Param('filename') filename: string, @Res() res: Response) {
  //   const filePath = `./uploads/${filename}`;

  //   if (!fs.existsSync(filePath)) {
  //     return res.status(HttpStatus.NOT_FOUND).json({
  //       message: '파일을 찾을 수 없습니다.',
  //     });
  //   }

  //   res.setHeader('Content-Type', 'video/mp4');
  //   res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  //   const fileStream = fs.createReadStream(filePath);
  //   fileStream.pipe(res);
  // }

  private async processVideoInBackground(
    jobId: string,
    videoData: VideoInputData,
  ) {
    try {
      const outputPath = await this.videoService.createVideo(videoData, jobId);

      this.videoGateway.sendCompleted(jobId, outputPath);
      console.log(`video created: ${outputPath}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.videoGateway.sendError(jobId, errorMessage);
      console.error(`video creation failed (${jobId}):`, error);
    }
  }
}
