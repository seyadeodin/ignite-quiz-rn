
import { useEffect } from 'react';
import { styles } from './styles';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface Props {
  total: number;
  current: number;
}

export function ProgressBar({ total, current }: Props) {
  const percentage = Math.round((current / total) * 100)
  const progress = useSharedValue(percentage)

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }))

  useEffect(() => {
    progress.value = withSpring(percentage)
  }, [current, total])

  return (
    <Animated.View style={styles.track}>
      <Animated.View style={[
        styles.progress,
        animatedProgressStyle]}
      />
    </Animated.View>
  );
}