import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Archive, Trash2 } from 'lucide-react-native';

interface CardProps {
  title: string;
  description: string;
  isFirst: boolean;
  index?: number;
  swipeX: Animated.SharedValue<number>;
  swipeY: Animated.SharedValue<number>;
}

export function Card({ title, description, isFirst, index = 0, swipeX, swipeY }: CardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    if (!isFirst) {
      return {
        transform: [
          { scale: interpolate(index, [0, 3], [1, 0.9]) },
          { translateY: index * 4 },
        ],
      };
    }

    const rotate = interpolate(
      swipeX.value,
      [-200, 0, 200],
      [-30, 0, 30],
      Extrapolate.CLAMP
    );

    return {
      zIndex: 1000 - index,
      transform: [
        { translateX: withSpring(swipeX.value) },
        { translateY: withSpring(swipeY.value) },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const keepIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      swipeX.value,
      [-200, -100],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity: withSpring(opacity),
      transform: [
        { scale: withSpring(opacity) },
      ],
    };
  });

  const trashIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      swipeX.value,
      [100, 200],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity: withSpring(opacity),
      transform: [
        { scale: withSpring(opacity) },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {isFirst && (
        <>
          <Animated.View style={[styles.indicator, styles.keepIndicator, keepIndicatorStyle]}>
            <Archive size={32} color="#4CAF50" />
            <Text style={[styles.indicatorText, styles.keepText]}>Keep</Text>
          </Animated.View>
          <Animated.View style={[styles.indicator, styles.trashIndicator, trashIndicatorStyle]}>
            <Trash2 size={32} color="#FF5252" />
            <Text style={[styles.indicatorText, styles.trashText]}>Trash</Text>
          </Animated.View>
        </>
      )}
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: '90%',
    height: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  indicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 2000,
  },
  keepIndicator: {
    left: '5%',
  },
  trashIndicator: {
    right: '5%',
  },
  indicatorText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  keepText: {
    color: '#4CAF50',
  },
  trashText: {
    color: '#FF5252',
  },
});