import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, ScrollView, TouchableOpacity, Alert, Pressable } from 'react-native';
import { HouseLine, Trash } from 'phosphor-react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { Header } from '../../components/Header';
import { HistoryCard, HistoryProps } from '../../components/HistoryCard';

import { styles } from './styles';
import { historyGetAll, historyRemove } from '../../storage/quizHistoryStorage';
import { Loading } from '../../components/Loading';
import Animated, { LightSpeedOutRight, SequencedTransition, ZoomIn, useAnimatedStyle, } from 'react-native-reanimated';
import { THEME } from '../../styles/theme';


const transition = SequencedTransition.duration(1000)

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<HistoryProps[]>([]);

  const { goBack } = useNavigation();

  const swipeableRefs = useRef<Swipeable[]>([])

  async function fetchHistory() {
    const response = await historyGetAll();
    setHistory(response);
    setIsLoading(false);
  }

  async function remove(id: string) {
    await historyRemove(id);

    fetchHistory();
  }

  function handleRemove(id: string, swipeablePos: number) {
    Alert.alert(
      'Remover',
      'Deseja remover esse registro?',
      [
        {
          text: 'Sim', onPress: () => remove(id)
        },
        { text: 'Não', style: 'cancel' }
      ]

    );

    swipeableRefs.current?.[swipeablePos].close();
  }
  const animatedTrashbin = useAnimatedStyle(() => ({
  
  }))
  useEffect(() => {
    fetchHistory();
  }, []);

  if (isLoading) {
    return <Loading />
  }



  return (
    <View style={styles.container} >
      <Header
        title="Histórico"
        subtitle={`Seu histórico de estudos${'\n'}realizados`}
        icon={HouseLine}
        onPress={goBack}
      />

      <ScrollView
        contentContainerStyle={styles.history}
        showsVerticalScrollIndicator={false}
      >
        {
          history.map((item, index) => (
            <Animated.View 
              layout={transition}
              exiting={LightSpeedOutRight}
              key={item.id}
              /*onPress={() => handleRemove(item.id)}*/
            >
              <Swipeable
                ref={(ref) => {
                  if(ref){
                    swipeableRefs.current.push(ref)
                  }
                }}
                overshootRight={false}
                leftThreshold={45}
                onSwipeableWillOpen={() => handleRemove(item.id, index)}
                containerStyle={styles.swipeableContainer}
                renderLeftActions={() => null}
                renderRightActions={({...rest}) => {
                  console.log(rest)
                  return(
                  <Pressable 
                    style={styles.swipeableRemove}
                    onPress={() => handleRemove(item.id, index)}
                  >
                    <Animated.View entering={ZoomIn}>
                      <Trash size={32} color={THEME.COLORS.GREY_100}/>
                    </Animated.View>
                  </Pressable>
                  )
                }}
              >
              <HistoryCard data={item} />
              </Swipeable>
            </Animated.View>
          ))
        }
      </ScrollView>
    </View>
  );
}
