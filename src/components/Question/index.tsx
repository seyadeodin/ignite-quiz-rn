import { View, Text, Dimensions } from 'react-native';
import Animate, { ReduceMotion, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming, Easing, ZoomOut, withDelay } from 'react-native-reanimated';

import { Option } from '../Option';
import { styles } from './styles';
import { useEffect } from 'react';

const SCREEN_WIDTH = Dimensions.get('window').width
type QuestionProps = {
  title: string;
  alternatives: string[];
}

type Props = {
  question: QuestionProps;
  alternativeSelected?: number | null;
  setAlternativeSelected?: (value: number) => void;
  isWrongQuestion: number;
}


const springShake = {
  duration: 50,
  dampingRatio: 0.6,
  stiffness: 30,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
  reduceMotion: ReduceMotion.System,
}


export function Question({ question, alternativeSelected, setAlternativeSelected, isWrongQuestion }: Props) {
  const position = useSharedValue(0);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    // transform: [{
    //   translateX: interpolate(
    //     position.value,
    //     [0, 0.5, 1, 1.5, 2, 2.5, 3], // trocar último valor por 3
    //     [0, -15, 0, 15, 0, -15, 3],
    //   )
    // }]
    transform: [{
      translateX: position.value
    }]
    //marginRight: position.value,
  }))

  function entering() {
    'worklet'
    const animations = {
      transform: [
        { scale: withDelay(100, withTiming(1, { duration: 500, easing: Easing.bezier(.46, 0, .35, 1.51) })) },
        {
          rotate: withDelay(0, withTiming('0deg', { duration: 500, easing: Easing.bezier(.46, 0, .35, 1.1) }))
        },
        { translateX: withTiming(0, { duration: 500 }) }
      ],
      opacity: withTiming(1, { duration: 450 })
    }

    const initialValues = {
      transform: [
        { scale: 2 },
        { rotate: '-90deg' },
        { translateX: SCREEN_WIDTH * -1 },
      ],
      opacity: 0.1
    }

    return { animations, initialValues }
  }

  function exiting() {
    'worklet'
    const animations = {
      transform: [
        {
          rotate: withDelay(0, withTiming('90deg', { duration: 500, easing: Easing.bezier(.46, 0, .35, 1.1) }))
        },
        { translateX: withTiming(SCREEN_WIDTH, { duration: 500 }) }
      ],
      opacity: withTiming(0, { duration: 450 })
    }

    const initialValues = {
      transform: [
        { rotate: '0deg' },
        { translateX: 0 },
      ],
      opacity: 0.1
    }

    return { animations, initialValues }

  }

  useEffect(() => {
    if (isWrongQuestion > 0) {
      position.value = withRepeat(withSequence(withSpring(6, springShake), withSpring(0, springShake)), 5)
      //shakeAnimation()
    }

  }, [isWrongQuestion])

  return (
    <Animate.View
      style={[styles.container, animatedProgressStyle]}
      entering={entering}
      exiting={exiting}
    >
      <Text style={styles.title}>
        {question.title}
      </Text>

      {
        question.alternatives.map((alternative, index) => (
          <Option
            key={index}
            title={alternative}
            checked={alternativeSelected === index}
            onPress={() => setAlternativeSelected && setAlternativeSelected(index)}
          />
        ))
      }
    </Animate.View>
  );
}