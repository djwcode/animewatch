import React from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
  SlideInUp,
  SlideOutDown,
  SlideInDown,
  SlideOutUp,
  ZoomIn,
  ZoomOut,
  EntryExitAnimationFunction,
} from 'react-native-reanimated';

interface PageTransitionProps {
  children: React.ReactNode;
  style?: ViewStyle;
  type?: 'fade' | 'slide-right' | 'slide-left' | 'slide-up' | 'slide-down' | 'zoom';
  duration?: number;
  delay?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  style,
  type = 'fade',
  duration = 300,
  delay = 0,
}) => {
  const getEnterAnimation = (): any => {
    switch (type) {
      case 'slide-right':
        return SlideInRight.duration(duration).delay(delay);
      case 'slide-left':
        return SlideInLeft.duration(duration).delay(delay);
      case 'slide-up':
        return SlideInUp.duration(duration).delay(delay);
      case 'slide-down':
        return SlideInDown.duration(duration).delay(delay);
      case 'zoom':
        return ZoomIn.duration(duration).delay(delay);
      case 'fade':
      default:
        return FadeIn.duration(duration).delay(delay);
    }
  };

  const getExitAnimation = (): any => {
    switch (type) {
      case 'slide-right':
        return SlideOutRight.duration(duration);
      case 'slide-left':
        return SlideOutLeft.duration(duration);
      case 'slide-up':
        return SlideOutUp.duration(duration);
      case 'slide-down':
        return SlideOutDown.duration(duration);
      case 'zoom':
        return ZoomOut.duration(duration);
      case 'fade':
      default:
        return FadeOut.duration(duration);
    }
  };

  return (
    <Animated.View
      style={style}
      entering={getEnterAnimation()}
      exiting={getExitAnimation()}
    >
      {children}
    </Animated.View>
  );
};
