# Reanimated
- useSharedValue
  - Variable that will store value used in our animations
  - Make animations reactive
- useAnimatedStyle
-  useAnimatedStyles
  - Define animation stylizaition rules and what properties will be animated
  - Needs to be applied to an aimated component
- Animated.Component
  - Component where the animated style applied
- Interpolate
  - Can crfeate very complex movement

# Animation
- `useSharedValue` stores the state value of our animations:
    ```tsx
    const scale = useSharedValue(1);
    const checked = useSharedValue(1);
    ```
- This value can then be interpolated by our component stylization in many different ways, as in:
    ```tsx
      const animatedContainerStyle = useAnimatedStyle(() => {
        return {
          transform: [{ scale: scale.value }],
          backgroundColor: interpolateColor(
            checked.value,
            [0, 1],
            ['transparent', COLOR]
          )
        }
      });

    ```
- We have a list of react navigation functions that will determine how this value will change.
``` tsx
function onPressIn() {
    scale.value = withTiming(1.1);
  }
```

- Aside from the animated components that come with reanimated we can also create one ourselves.
    ```tsx
    const PressableAnimated = Animated.createAnimatedComponent(Pressable);
    // snip
    <PressableAnimated 
      onPressIn={onPressIn} 
      onPressOut={onPressOut} 
      style={[ styles.container, { borderColor: COLOR }, animatedContainerStyle ]}
      {...rest}>
        <Animated.Text style={[ styles.title, animatedTextStyle ]}>
          {title}
        </Animated.Text>
    </PressableAnimated>
    ```

### Index of animations in the project
- [[./src/components/ProgressBar/]] has a progress bar animation that uses percentage and width to determine the appearence of the bar.
- [[./src/components/Level/index.tsx]] we use color interpolation to change the background color of our tags
- [[./src/components/Question//index]] we use `withRepeat`, `withSequence` and `withSpring` to create a complex shake animation. We also create a spring shake object that determines how this string animation plays out.
- [[./src/components/QuizCard/]] we use the `entering` and `exiting` properties of th animated component to show a transition evertime the component is render in/out using the index of each item to create a sequential animation.
- [[./src/components/Question/index.tsx]] we create complex animation patterns to create the card movement effect when a quiz question changes. https://github.com/rocketseat-education/ignite-rn-06-ignite-quiz/commit/8ffe2348da32577de9448f6c6255187d6349fbe2 shows the same effect done using KeyFrames
- [[.src/screens/History/index.tsx]] shows the use of the `layout` props using one of the manyy layout animations contained in `Layout`
