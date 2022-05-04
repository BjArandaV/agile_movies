import React from 'react';
import { View } from 'react-native';

export const Container = ({ children }) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
      }}>
      {children}
    </View>
  );
};
