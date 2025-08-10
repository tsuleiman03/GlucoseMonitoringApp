// v2 - Adds state to capture user input
import { Image } from 'expo-image';
import { Platform, StyleSheet, TextInput, Button, Alert } from 'react-native';
import React, { useState } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  // This is our new state variable to "remember" the input text.
  // 'useState' is a React Hook that lets you add state to a component.
  const [glucoseValue, setGlucoseValue] = useState('');

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Glucose Monitor</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* This is our new form section */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText>Glucose Reading (mmol)</ThemedText>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad" // This brings up a number pad on the phone
          placeholder="Enter reading..." // Placeholder text when the input is empty
          value={glucoseValue} // The value of the input is tied to our state variable
          onChangeText={setGlucoseValue} // This function is called every time the text changes
        />
        <Button 
          title="Save Reading" 
          // When the button is pressed, it shows an alert with the current value
          onPress={() => Alert.alert('Value Saved', 'You entered: ' + glucoseValue)} 
        />
      </ThemedView>

    </ParallaxScrollView>
  );
}

// These are the styles for our components
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    padding: 16, // Added some padding to make it look nicer
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8, // Added rounded corners
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'white' // A light gray color for text, good for dark mode
  },
});
