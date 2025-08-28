declare module 'expo-video' {
  import { ComponentType } from 'react';
  import { ViewProps } from 'react-native';

  export interface VideoPlayer {
    play(): void;
    pause(): void;
    seekTo(time: number): void;
    currentTime?: number;
    duration?: number;
    loop?: boolean;
    onPlaybackStatusUpdate?: (status: any) => void;
  }

  export interface VideoViewProps extends ViewProps {
    player: VideoPlayer;
    allowsFullscreen?: boolean;
    allowsPictureInPicture?: boolean;
  }

  export const VideoView: ComponentType<VideoViewProps>;
  export function useVideoPlayer(source: string): VideoPlayer;
}
