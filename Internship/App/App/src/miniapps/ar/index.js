import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ARApp = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AR Mini-App Connected!</Text>
      <Text style={styles.subtitle}>Ready for Module Federation.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ef4444', // Tailwind red-500
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 8,
  },
  subtitle: {
    color: '#fee2e2', // Tailwind red-100
    fontSize: 16,
    marginTop: 10,
  },
});

export default ARApp;