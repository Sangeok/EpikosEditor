// remotion/compositions/VideoEditor.tsx
import {
  AbsoluteFill,
  getInputProps,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Img,
  Audio,
  OffthreadVideo,
  interpolate,
} from 'remotion';
import React from 'react';
import type {
  TextElement,
  MediaElement,
  AudioElement,
  VideoEditorProps,
} from '../../types';

const GlobalFonts: React.FC = () => (
  <style>
    {`@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;500;700&display=swap');`}
  </style>
);

const TextSequence: React.FC<{ textElement: TextElement; fps: number }> = ({
  textElement,
  fps,
}) => {
  const fromFrame = Math.floor(textElement.startTime * fps);
  const durationInFrames = Math.floor(
    (textElement.endTime - textElement.startTime) * fps,
  );

  return (
    <Sequence
      key={textElement.id}
      from={fromFrame}
      durationInFrames={durationInFrames}
      name={`Text: ${textElement.text.substring(0, 20)}...`}
      style={{ height: '100%', overflow: 'hidden' }}
    >
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `translate(${textElement.positionX}px, ${textElement.positionY}px) translateX(-50%)`,
            width: 'fit-content',
            maxWidth: textElement.maxWidth ?? '100%',
            height: 'auto',
            display: 'inline-block',
            padding: '5px',
            whiteSpace: textElement.whiteSpace ?? 'pre-wrap',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            borderRadius: '4px',
            boxSizing: 'border-box',
            textAlign: 'center',
            fontSize: `${textElement.fontSize}px`,
            fontFamily: textElement.font || 'Roboto Condensed, sans-serif',
            color: textElement.textColor,
            backgroundColor: textElement.backgroundColor,
          }}
        >
          {textElement.text}
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};

const ImageSequence: React.FC<{ mediaElement: MediaElement; fps: number }> = ({
  mediaElement,
  fps,
}) => {
  const fromFrame = Math.floor(mediaElement.startTime * fps);
  const durationInFrames = Math.floor(
    (mediaElement.endTime - mediaElement.startTime) * fps,
  );

  const ImageWithFade = () => {
    const frame = useCurrentFrame();
    let opacity = 1;

    if (mediaElement.fadeIn) {
      const fadeInFrames = Math.floor(
        (mediaElement.fadeInDuration || 0.5) * fps,
      );
      opacity = interpolate(frame, [0, fadeInFrames], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
    }

    if (mediaElement.fadeOut) {
      const fadeOutFrames = Math.floor(
        (mediaElement.fadeOutDuration || 0.5) * fps,
      );
      const fadeOutStartFrame = durationInFrames - fadeOutFrames;
      const fadeOutOpacity = interpolate(
        frame,
        [fadeOutStartFrame, durationInFrames],
        [1, 0],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        },
      );
      opacity = Math.min(opacity, fadeOutOpacity);
    }

    return (
      <AbsoluteFill
        style={{
          zIndex: 100,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity,
        }}
      >
        <Img
          style={{
            pointerEvents: 'none',
            zIndex: 100,
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
          src={mediaElement.url || ''}
          alt={'image'}
        />
      </AbsoluteFill>
    );
  };

  return (
    <Sequence
      key={mediaElement.id}
      from={fromFrame}
      durationInFrames={durationInFrames}
      name={`Image: ${mediaElement.id}`}
    >
      <ImageWithFade />
    </Sequence>
  );
};

const VideoSequence: React.FC<{ mediaElement: MediaElement; fps: number }> = ({
  mediaElement,
  fps,
}) => {
  const fromFrame = Math.floor(mediaElement.startTime * fps);
  const durationInFrames = Math.floor(
    (mediaElement.endTime - mediaElement.startTime) * fps,
  );

  return (
    <Sequence
      key={mediaElement.id}
      from={fromFrame}
      durationInFrames={durationInFrames}
      name={`Video: ${mediaElement.id}`}
      style={{ height: '100%', zIndex: 100, pointerEvents: 'none' }}
    >
      <OffthreadVideo
        src={mediaElement.url || ''}
        volume={mediaElement.volume || 100}
        style={{
          pointerEvents: 'none',
          top: 0,
          left: 0,
          width: mediaElement.width || '100%',
          height: mediaElement.height || 'auto',
          position: 'absolute',
        }}
      />
    </Sequence>
  );
};

const AudioSequence: React.FC<{ audioElement: AudioElement; fps: number }> = ({
  audioElement,
  fps,
}) => {
  const fromFrame = Math.floor(audioElement.startTime * fps);
  const durationInFrames = Math.floor(
    (audioElement.endTime - audioElement.startTime) * fps,
  );

  return (
    <Sequence
      key={audioElement.id}
      from={fromFrame}
      durationInFrames={durationInFrames}
      name={`Audio: ${audioElement.id}`}
    >
      <AbsoluteFill>
        <Audio
          src={audioElement.url || ''}
          volume={audioElement.volume || 100}
          startFrom={Math.floor((audioElement.sourceStart ?? 0) * fps)}
        />
      </AbsoluteFill>
    </Sequence>
  );
};

export const VideoEditor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inputProps = getInputProps() as unknown as VideoEditorProps | undefined;

  console.log('VideoEditor frame:', frame, 'fps:', fps);
  console.log('VideoEditor inputProps:', JSON.stringify(inputProps, null, 2));

  if (!inputProps) {
    console.log('VideoEditor: No input data provided');
    return (
      <AbsoluteFill style={{ backgroundColor: 'black' }}>
        <div
          style={{
            color: 'white',
            fontSize: 24,
            textAlign: 'center',
            paddingTop: '40%',
          }}
        >
          No input data provided
        </div>
      </AbsoluteFill>
    );
  }

  const currentTime = frame / fps;

  console.log(`VideoEditor currentTime: ${currentTime}s, elements:`, {
    text: inputProps.media?.textElement?.length || 0,
    media: inputProps.media?.mediaElement?.length || 0,
    audio: inputProps.media?.audioElement?.length || 0,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <GlobalFonts />
      {/* 텍스트 요소 렌더링 */}
      {inputProps.media?.textElement?.map((textElement) => (
        <TextSequence
          key={textElement.id}
          textElement={textElement}
          fps={fps}
        />
      ))}

      {/* 미디어 요소 렌더링 */}
      {inputProps.media?.mediaElement?.map((mediaElement) => {
        if (mediaElement.type === 'image') {
          return (
            <ImageSequence
              key={mediaElement.id}
              mediaElement={mediaElement}
              fps={fps}
            />
          );
        }
        if (mediaElement.type === 'video') {
          return (
            <VideoSequence
              key={mediaElement.id}
              mediaElement={mediaElement}
              fps={fps}
            />
          );
        }
        return null;
      })}

      {/* 오디오 요소 렌더링 */}
      {inputProps.media?.audioElement?.map((audioElement) => (
        <AudioSequence
          key={audioElement.id}
          audioElement={audioElement}
          fps={fps}
        />
      ))}
    </AbsoluteFill>
  );
};
