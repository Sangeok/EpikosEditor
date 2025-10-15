// video.controller.ts
import {
  BadRequestException,
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import type { Express } from 'express';
import type { Response } from 'express';
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAsset(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('file is required');
    }

    const uploadDir = path.resolve(process.cwd(), 'uploads');
    await fs.promises.mkdir(uploadDir, { recursive: true });

    const ext = (() => {
      const m = file.mimetype || '';
      if (m.includes('mp4')) return '.mp4';
      if (m.includes('mpeg')) return '.mp3';
      if (m.includes('wav')) return '.wav';
      if (m.includes('png')) return '.png';
      if (m.includes('jpeg') || m.includes('jpg')) return '.jpg';
      if (m.includes('webp')) return '.webp';
      return '';
    })();

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filepath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filepath, file.buffer);

    const port = process.env.PORT ?? 8080;
    const base = process.env.API_BASE_URL || `http://localhost:${port}`;
    const url = `${base}/uploads/${filename}`;

    return { success: true, url };
  }

  // 영상 다운로드 (강제 다운로드)
  @Get('download/:filename')
  downloadVideo(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.resolve(process.cwd(), 'uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: '파일을 찾을 수 없습니다.',
      });
    }

    return res.download(filePath);
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
