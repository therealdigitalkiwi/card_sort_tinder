import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { Card } from '@/components/Card';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCardStore } from '@/store/cardStore';

export default function CardSortingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { cards, savedCards, addSavedCard, removeCard } = useCardStore();
  const swipeX = useSharedValue(0);
  const swipeY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onChange((event) => {
      swipeX.value = event.translationX;
      swipeY.value = event.translationY;
    })
    .onEnd((event) => {
      const shouldKeep = event.translationX < -100;
      const shouldTrash = event.translationX > 100;

      if (shouldKeep && savedCards.length < 10) {
        addSavedCard(cards[0]);
        removeCard(cards[0].id);
        
        // If we've reached 10 saved cards, navigate to saved tab
        if (savedCards.length === 9) {
          setTimeout(() => router.push('/saved'), 500);
        }
      } else if (shouldTrash) {
        removeCard(cards[0].id);
      }

      swipeX.value = 0;
      swipeY.value = 0;
    });

  const renderCard = useCallback(
    (card: typeof cards[0], index: number) => (
      <Card
        key={card.id}
        title={card.title}
        description={card.description}
        isFirst={index === 0}
        index={index}
        swipeX={swipeX}
        swipeY={swipeY}
      />
    ),
    [swipeX, swipeY]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.counter}>
        {savedCards.length} / 10 cards saved
      </Text>
      <View style={styles.cardContainer}>
        <GestureDetector gesture={gesture}>
          <View style={styles.cardStack}>
            {cards.slice(0, 3).map(renderCard)}
          </View>
        </GestureDetector>
      </View>
      <Text style={styles.instruction}>
        Swipe left to keep, right to trash
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  counter: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    color: '#007AFF',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStack: {
    width: '100%',
    aspectRatio: 0.7,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
});