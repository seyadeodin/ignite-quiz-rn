import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { styles } from './styles';

import { QUIZ } from '../../data/quiz';
import { historyAdd } from '../../storage/quizHistoryStorage';

import { Loading } from '../../components/Loading';
import { Question } from '../../components/Question';
import { QuizHeader } from '../../components/QuizHeader';
import { ConfirmButton } from '../../components/ConfirmButton';
import { OutlineButton } from '../../components/OutlineButton';
import { ProgressBar } from '../../components/ProgressBar';
import { THEME } from '../../styles/theme';

interface Params {
  id: string;
}

type QuizProps = typeof QUIZ[0];

export function Quiz() {
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quiz, setQuiz] = useState<QuizProps>({} as QuizProps);
  const [alternativeSelected, setAlternativeSelected] = useState<null | number>(null);
  const [isWrongQuestion, setIsWrongQuestion] = useState(0)

  const scrollY = useSharedValue(0)

  const { navigate } = useNavigation();

  const route = useRoute();
  const { id } = route.params as Params;

  function handleSkipConfirm() {
    Alert.alert('Pular', 'Deseja realmente pular a questão?', [
      { text: 'Sim', onPress: () => handleNextQuestion() },
      { text: 'Não', onPress: () => { } }
    ]);
  }

  async function handleFinished() {
    await historyAdd({
      id: new Date().getTime().toString(),
      title: quiz.title,
      level: quiz.level,
      points,
      questions: quiz.questions.length
    });

    navigate('finish', {
      points: String(points),
      total: String(quiz.questions.length),
    });
  }

  function handleNextQuestion() {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prevState => prevState + 1)
    } else {
      handleFinished();
    }
  }

  async function handleConfirm() {
    if (alternativeSelected === null) {
      return handleSkipConfirm();
    }

    if (quiz.questions[currentQuestion].correct === alternativeSelected) {
      setIsWrongQuestion(0);
      setPoints(prevState => prevState + 1);
    }

    if (quiz.questions[currentQuestion].correct !== alternativeSelected) {
      setIsWrongQuestion(prev => prev + 1);
    }

    setAlternativeSelected(null);
  }

  function handleStop() {
    Alert.alert('Parar', 'Deseja parar agora?', [
      {
        text: 'Não',
        style: 'cancel',
      },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: () => navigate('home')
      },
    ]);

    return true;
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      console.log("LS -> src/screens/Quiz/index.tsx:105 -> contentOffset: ", contentOffset.y)
      scrollY.value = contentOffset.y
    }
  })

  const fixedProgressBarStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: '-5%',
    opacity: interpolate(
      scrollY.value,
      [55, 70, 90],
      [0, 0.8, 1],
      Extrapolation.CLAMP
    ),
    transform: [
      { translateY: interpolate(
      scrollY.value,
      [55, 100],
      [-40,  0],
      Extrapolation.CLAMP)
      }
    ],
    paddingTop: 50,
      //paddingHorizontal: 20,
    zIndex: 50,
    backgroundColor: THEME.COLORS.GREY_500,
    width: '110%'
  }))

  const headerStyles = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, 80],
      [1, 0],
      Extrapolation.CLAMP
    )
  }))

  useEffect(() => {
    const quizSelected = QUIZ.filter(item => item.id === id)[0];
    setQuiz(quizSelected);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (quiz.questions) {
      handleNextQuestion();
    }
  }, [points]);

  if (isLoading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <Animated.View style={fixedProgressBarStyle}>
        <Text style={styles.title}>{quiz.title}</Text>
        <ProgressBar total={quiz.questions.length} current={currentQuestion + 1}/>
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.question}
        onScroll={scrollHandler} //
        scrollEventThrottle={16} // ios scroll update faster
      >
        <Animated.ScrollView style={headerStyles}>
          <QuizHeader
            title={quiz.title}
            currentQuestion={currentQuestion + 1}
            totalOfQuestions={quiz.questions.length}
          />
        </Animated.ScrollView>

        <Question
          key={quiz.questions[currentQuestion].title}
          question={quiz.questions[currentQuestion]}
          alternativeSelected={alternativeSelected}
          setAlternativeSelected={setAlternativeSelected}
          isWrongQuestion={isWrongQuestion}
        />

        <View style={styles.footer}>
          <OutlineButton title="Parar" onPress={handleStop} />
          <ConfirmButton onPress={handleConfirm} />
        </View>
      </Animated.ScrollView>
    </View >
  );
}
