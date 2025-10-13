// remotion/compositions/MyComposition.tsx
import React from 'react';
import { Composition, getInputProps } from 'remotion';
import { VideoEditor } from './VideoEditor';

interface InputProps {
  project: {
    id: string;
    name: string;
  };
  media: {
    projectDuration: number;
    fps: number;
    textElement: Array<any>;
    mediaElement: Array<any>;
    audioElement: Array<any>;
  };
}

export const MyComposition: React.FC = () => {
  const inputProps = getInputProps() as unknown as InputProps;

  // 기본값 설정
  const fps = inputProps?.media?.fps || 30;
  const duration = inputProps?.media?.projectDuration || 10;
  const durationInFrames = Math.floor(duration * fps) + 1;

  console.log('MyComposition inputProps:', inputProps);
  console.log('Calculated durationInFrames:', durationInFrames, 'fps:', fps);

  return (
    <Composition
      id="MyComposition"
      component={VideoEditor}
      durationInFrames={durationInFrames}
      fps={fps}
      width={1080}
      height={1920}
    />
  );
};
