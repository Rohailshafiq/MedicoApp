import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useAppState } from '../Context/AppContext'


const index = () => {
  const { dispatch, userStateConfig } = useAppState();
  const startValue = useRef(new Animated.Value(1)).current;
  const endValue = 1.5;

  useEffect(() => {
    if (userStateConfig.user) {
      dispatch('LOADER_OFF');
    }
  }, [userStateConfig.user])

  useEffect(() => {
    Animated.spring(startValue, {
      toValue: endValue,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [startValue]);

  return (
    <View style={styles.container}>
      <Animated.Image
        style={[
          styles.square,
          {
            transform: [
              {
                scale: startValue,
              },
            ],
          },
        ]}
        source={require('../images/logo.jpeg')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  square: {
    height: 150,
    width: 300,
  },
});

export default index;