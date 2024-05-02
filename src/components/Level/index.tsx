import { TouchableOpacity, Text, View, Pressable, PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  ReduceMotion,
  interpolateColor,
  withTiming,
} from 'react-native-reanimated';

import { THEME } from '../../styles/theme';
import { styles } from './styles';
import { useEffect } from 'react';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const TYPE_COLORS = {
  EASY: THEME.COLORS.BRAND_LIGHT,
  HARD: THEME.COLORS.DANGER_LIGHT,
  MEDIUM: THEME.COLORS.WARNING_LIGHT,
}

type Props = PressableProps & {
  title: string;
  isChecked?: boolean;
  type?: keyof typeof TYPE_COLORS;
  onPress: () => void;
}

const spring = {
  mass: 6.6,
  damping: 20,
  stiffness: 180,
  overshootClamping: false,
  restDisplacementThreshold: 26.8,
  restSpeedThreshold: 2,
  reduceMotion: ReduceMotion.System,
}

export function Level({ title, type = 'EASY', isChecked = false, onPress, ...rest }: Props) {
  const scale = useSharedValue(1);
  const checked = useSharedValue(0)

  const COLOR = TYPE_COLORS[type];

  const animatedContainerStyle = useAnimatedStyle(() => ({
    //transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      checked.value, [0, 1],
      ['transparent', COLOR],
      'RGB',
      { gamma: 2.2 }
    )
  }))

  const animatedTextStyle = useAnimatedStyle(() => ({
    //transform: [{ scale: scale.value }],
    color: interpolateColor(
      checked.value, [1, 0],
      [THEME.COLORS.GREY_100, COLOR],
      'RGB',
      { gamma: 2.2 }
    )
  }))

  function onPressIn() {
    scale.value = withSpring(1.10, spring)
  }

  function onPressOut() {
    withSpring(1, spring)
  }

  useEffect(() => {
    checked.value = isChecked ? withTiming(1, { duration: 1000 }) : withTiming(0, { duration: 1000 });
  }, [isChecked])

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => {
        onPress();
        scale.value = withSequence(withSpring(1.05), withDelay(10, withSpring(1)));
      }}
      style={[
        styles.container,
        { borderColor: COLOR, },
        animatedContainerStyle,
      ]}
    >
      <Animated.Text style={
        [
          styles.title,
          animatedTextStyle
        ]}>
        {title}
      </Animated.Text>
    </AnimatedPressable >
  );
}