import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import * as path from 'path';
import { VideoService } from './video.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class VideoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private jobSockets = new Map<string, Set<string>>();

  constructor(
    @Inject(forwardRef(() => VideoService))
    private videoService: VideoService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`client disconnected: ${client.id}`);
    this.cleanupClientFromJobs(client.id);
  }

  @SubscribeMessage('subscribeToJob')
  handleSubscribeToJob(
    client: Socket,
    payload: { jobId: string; clientId: string },
  ) {
    const { jobId, clientId } = payload;
    this.subscribeToJob(jobId, clientId);
    client.emit('subscribed', { jobId, message: 'job subscribed!!!' });
  }

  @SubscribeMessage('cancelJob')
  handleCancelJob(client: Socket, payload: { jobId: string }) {
    const { jobId } = payload;
    console.log(`cancel job request: ${jobId} from client: ${client.id}`);

    const success = this.videoService.cancelJob(jobId);

    client.emit('cancelResponse', {
      jobId,
      success,
      message: success ? 'job cancelled!!!' : "Can't find job",
    });
  }

  subscribeToJob(jobId: string, clientId: string) {
    if (!this.jobSockets.has(jobId)) {
      this.jobSockets.set(jobId, new Set());
    }
    this.jobSockets.get(jobId)!.add(clientId);
    console.log(`${clientId} subscribed to job ${jobId}`);
  }

  sendProgress(jobId: string, progress: number) {
    const clients = this.jobSockets.get(jobId);
    if (clients) {
      clients.forEach((clientId) => {
        this.server.to(clientId).emit('progress', {
          jobId,
          progress: Math.round(progress * 100),
        });
      });
    }
  }

  sendCompleted(jobId: string, outputPath: string) {
    const clients = this.jobSockets.get(jobId);
    if (clients) {
      const filename = path.basename(outputPath);
      const port = process.env.PORT ?? 8080;
      const base = process.env.API_BASE_URL || `http://localhost:${port}`;
      const downloadUrl = `${base}/video/download/${filename}`;

      clients.forEach((clientId) => {
        this.server.to(clientId).emit('completed', {
          jobId,
          outputPath,
          filename,
          downloadUrl,
        });
      });
      this.jobSockets.delete(jobId);
    }
  }

  sendCancelled(jobId: string) {
    const clients = this.jobSockets.get(jobId);
    if (clients) {
      clients.forEach((clientId) => {
        this.server.to(clientId).emit('cancelled', { jobId });
      });
      this.jobSockets.delete(jobId);
    }
  }

  sendError(jobId: string, error: string) {
    const clients = this.jobSockets.get(jobId);
    if (clients) {
      clients.forEach((clientId) => {
        this.server.to(clientId).emit('error', {
          jobId,
          error,
        });
      });
      this.jobSockets.delete(jobId);
    }
  }

  private cleanupClientFromJobs(clientId: string) {
    this.jobSockets.forEach((clients, jobId) => {
      clients.delete(clientId);
      if (clients.size === 0) {
        this.jobSockets.delete(jobId);
      }
    });
  }
}
