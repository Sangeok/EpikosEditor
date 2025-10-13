import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { VideoGateway } from './video.gateway';

@Module({
  controllers: [VideoController],
  providers: [VideoService, VideoGateway],
  exports: [VideoService, VideoGateway],
})
export class VideoModule {}
