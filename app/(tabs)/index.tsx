// app/(tabs)/index.tsx

// Version: 1.9.1
// Date: 2025-08-10
// Changes: Fixed syntax error by moving mock data declarations after imports.

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Platform, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { MealSelectionModal, MealItem } from '@/components/MealSelectionModal';
import { ExerciseSelectionModal, ExerciseItem } from '@/components/ExerciseSelectionModal';

// --- FIX: Moved mock data after imports ---
const MOCK_MEAL_OPTIONS: MealItem[] = [
  { id: 'c-s', name: 'Chicken', portion: 'small' },
  { id: 'c-m', name: 'Chicken', portion: 'medium' },
  { id: 'c-l', name: 'Chicken', portion: 'large' },
  { id: 'b-s', name: 'Broccoli', portion: 'small' },
  { id: 'b-m', name: 'Broccoli', portion: 'medium' },
  { id: 'b-l', name: 'Broccoli', portion: 'large' },
];

const MOCK_EXERCISE_OPTIONS: ExerciseItem[] = [
    { id: 'w-l', name: 'Walk', intensity: 'low' },
    { id: 'w-m', name: 'Walk', intensity: 'moderate' },
    { id: 'r-l', name: 'Running', intensity: 'low' },
    { id: 'r-m', name: 'Running', intensity: 'moderate' },
    { id: 'r-h', name: 'Running', intensity: 'high' },
];

export default function GlucoseMonitor() {
  const now = new Date();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const [step, setStep] = useState<0 | 1 | 2>(0);

  // Reading
  const [readingDate, setReadingDate] = useState(now);
  const [glucose, setGlucose] = useState('5.5');
  const [measurementType, setMeasurementType] = useState<'fasting' | 'random'>('random');
  const [notes, setNotes] = useState('');

  // Meal
  const [mealDate, setMealDate] = useState(now);
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<MealItem[]>([]);

  // Exercise
  const [exerciseDate, setExerciseDate] = useState(now);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<ExerciseItem[]>([]);
  const [duration, setDuration] = useState('');

  const glucoseNumber = Number(glucose);
  const glucoseValid = !Number.isNaN(glucoseNumber) && glucoseNumber > 0 && glucoseNumber <= 40;

  const handleNudge = (amount: number) => {
    const currentValue = parseFloat(glucose) || 0;
    let newValue = Math.max(0, currentValue + amount);
    if (newValue > 40) newValue = 40;
    setGlucose(newValue.toFixed(1));
  };

  const StepHeader = () => (
    <View style={styles.stepHeader}>
      {['1-Glucose Reading', '2-Last Meal', '3-Exercise'].map((label, i) => (
        <View key={label} style={[styles.stepDotWrap, step === i && styles.stepDotWrapActive]}>
          <View style={[styles.stepDot, { backgroundColor: themeColors.icon }, step === i && { backgroundColor: themeColors.tint }]} />
          <Text style={[styles.stepLabel, { color: themeColors.icon }, step === i && styles.stepLabelActive]}>{label}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.header, { color: themeColors.text }]}>Glucose Monitor 🩸</Text>
        <StepHeader />

        {step === 0 && (
          <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.icon }]}>
            <Text style={[styles.cardTitle, { color: themeColors.text }]}>1-Glucose Reading</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: themeColors.text }]}>Date</Text>
                <View style={[styles.dateTimePickerContainer, { backgroundColor: themeColors.background }]}>
                  <DateTimePicker value={readingDate} mode="date" onChange={(e, d) => d && setReadingDate(d)} textColor={themeColors.text} />
                </View>
              </View>
              <View style={styles.spacer} />
              <View style={styles.col}>
                <Text style={[styles.label, { color: themeColors.text }]}>Time</Text>
                <View style={[styles.dateTimePickerContainer, { backgroundColor: themeColors.background }]}>
                  <DateTimePicker value={readingDate} mode="time" onChange={(e, d) => d && setReadingDate(d)} textColor={themeColors.text} />
                </View>
              </View>
            </View>
            <Text style={[styles.label, { color: themeColors.text }]}>Measurement Type</Text>
            <View style={styles.segmentedControl}>
              <Pressable style={[styles.segmentButton, measurementType === 'fasting' && { backgroundColor: themeColors.tint }]} onPress={() => setMeasurementType('fasting')}>
                <Text style={[styles.segmentText, { color: measurementType === 'fasting' ? themeColors.background : themeColors.text }]}>Fasting</Text>
              </Pressable>
              <Pressable style={[styles.segmentButton, measurementType === 'random' && { backgroundColor: themeColors.tint }]} onPress={() => setMeasurementType('random')}>
                <Text style={[styles.segmentText, { color: measurementType === 'random' ? themeColors.background : themeColors.text }]}>Random</Text>
              </Pressable>
            </View>
            <Text style={[styles.label, { color: themeColors.text, marginTop: 12 }]}>Glucose (mmol/L)</Text>
            <View style={styles.inputRow}>
              <Pressable style={[styles.nudgeBtn, { backgroundColor: themeColors.icon }]} onPress={() => handleNudge(-0.1)}>
                <Text style={[styles.nudgeText, { color: themeColors.background }]}>-</Text>
              </Pressable>
              <TextInput style={[styles.input, styles.inputGlucose, { color: themeColors.text, backgroundColor: themeColors.background, borderColor: themeColors.icon }, !glucoseValid && glucose.length > 0 && { borderColor: themeColors.error }]} keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'} placeholder="e.g. 5.6" placeholderTextColor={themeColors.icon} value={glucose} onChangeText={setGlucose} textAlign="center" />
              <Pressable style={[styles.nudgeBtn, { backgroundColor: themeColors.icon }]} onPress={() => handleNudge(0.1)}>
                <Text style={[styles.nudgeText, { color: themeColors.background }]}>+</Text>
              </Pressable>
            </View>
            {!glucoseValid && glucose.length > 0 && (<Text style={[styles.error, { color: themeColors.error }]}>Enter a value between 0 and 40 mmol/L</Text>)}
             <Text style={[styles.label, { color: themeColors.text, marginTop: 12 }]}>Notes</Text>
            <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top', color: themeColors.text, backgroundColor: themeColors.background, borderColor: themeColors.icon }]} multiline value={notes} onChangeText={setNotes} placeholder="Optional notes..." placeholderTextColor={themeColors.icon} />
          </View>
        )}

        {step === 1 && (
          <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.icon }]}>
            <Text style={[styles.cardTitle, { color: themeColors.text }]}>2-Last Meal</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: themeColors.text }]}>Date</Text>
                <View style={[styles.dateTimePickerContainer, { backgroundColor: themeColors.background }]}>
                  <DateTimePicker value={mealDate} mode="date" onChange={(e, d) => d && setMealDate(d)} textColor={themeColors.text} />
                </View>
              </View>
              <View style={styles.spacer} />
              <View style={styles.col}>
                <Text style={[styles.label, { color: themeColors.text }]}>Time</Text>
                <View style={[styles.dateTimePickerContainer, { backgroundColor: themeColors.background }]}>
                  <DateTimePicker value={mealDate} mode="time" onChange={(e, d) => d && setMealDate(d)} textColor={themeColors.text} />
                </View>
              </View>
            </View>
            <Text style={[styles.label, { color: themeColors.text }]}>Selected Items</Text>
            <View style={styles.tagContainer}>
              {selectedMeals.length > 0 ? selectedMeals.map(m => (
                <View key={m.id} style={[styles.tag, { backgroundColor: themeColors.tint }]}>
                  <Text style={[styles.tagText, { color: themeColors.background }]}>{`${m.name} (${m.portion})`}</Text>
                </View>
              )) : <Text style={{color: themeColors.icon}}>None</Text>}
            </View>
            <Pressable style={[styles.navBtn, { backgroundColor: themeColors.icon, marginTop: 8 }]} onPress={() => setMealModalVisible(true)}>
              <Text style={[styles.navText, { color: themeColors.background }]}>+ Add / Edit Meal Items</Text>
            </Pressable>
          </View>
        )}

        {step === 2 && (
          <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.icon }]}>
            <Text style={[styles.cardTitle, { color: themeColors.text }]}>3-Exercise</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: themeColors.text }]}>Date</Text>
                <View style={[styles.dateTimePickerContainer, { backgroundColor: themeColors.background }]}>
                  <DateTimePicker value={exerciseDate} mode="date" onChange={(e, d) => d && setExerciseDate(d)} textColor={themeColors.text} />
                </View>
              </View>
              <View style={styles.spacer} />
              <View style={styles.col}>
                <Text style={[styles.label, { color: themeColors.text }]}>Time</Text>
                <View style={[styles.dateTimePickerContainer, { backgroundColor: themeColors.background }]}>
                  <DateTimePicker value={exerciseDate} mode="time" onChange={(e, d) => d && setExerciseDate(d)} textColor={themeColors.text} />
                </View>
              </View>
            </View>
            <Text style={[styles.label, { color: themeColors.text }]}>Selected Exercises</Text>
            <View style={styles.tagContainer}>
              {selectedExercises.length > 0 ? selectedExercises.map(e => (
                <View key={e.id} style={[styles.tag, { backgroundColor: themeColors.tint }]}>
                  <Text style={[styles.tagText, { color: themeColors.background }]}>{`${e.name} (${e.intensity})`}</Text>
                </View>
              )) : <Text style={{color: themeColors.icon}}>None</Text>}
            </View>
            <Pressable style={[styles.navBtn, { backgroundColor: themeColors.icon, marginTop: 8 }]} onPress={() => setExerciseModalVisible(true)}>
              <Text style={[styles.navText, { color: themeColors.background }]}>+ Add / Edit Exercises</Text>
            </Pressable>
            <Text style={[styles.label, { color: themeColors.text, marginTop: 12 }]}>Duration (minutes)</Text>
            <TextInput style={[styles.input, { color: themeColors.text, backgroundColor: themeColors.background, borderColor: themeColors.icon }]} keyboardType="number-pad" value={duration} onChangeText={setDuration} placeholder="e.g. 30" placeholderTextColor={themeColors.icon} />
          </View>
        )}

        <View style={styles.navRow}>
          <Pressable style={[styles.navBtn, { backgroundColor: themeColors.icon }, step === 0 && styles.navBtnDisabled]} disabled={step === 0} onPress={() => setStep((s) => (s === 0 ? 0 : ((s - 1) as 0 | 1 | 2)))}>
            <Text style={[styles.navText, { color: themeColors.background }]}>‹ Back</Text>
          </Pressable>
          {step < 2 ? (
            <Pressable style={[styles.navBtn, { backgroundColor: themeColors.tint }, step === 0 && !glucoseValid && styles.navBtnDisabled]} disabled={step === 0 && !glucoseValid} onPress={() => setStep((s) => ((s + 1) as 0 | 1 | 2))}>
              <Text style={[styles.navText, { color: themeColors.background }]}>Next ›</Text>
            </Pressable>
          ) : (
            <Pressable style={[styles.saveBtn, { backgroundColor: themeColors.tint }, !glucoseValid && styles.navBtnDisabled]} disabled={!glucoseValid} onPress={() => console.log('SAVE', { readingDate, glucose: glucoseNumber, measurementType, notes, selectedMeals, exerciseDate, selectedExercises, duration })}>
              <Text style={styles.saveText}>Save Reading</Text>
            </Pressable>
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
      <MealSelectionModal visible={mealModalVisible} mealOptions={MOCK_MEAL_OPTIONS} selectedMeals={selectedMeals} onClose={() => setMealModalVisible(false)} onSelectionChange={setSelectedMeals} />
      <ExerciseSelectionModal visible={exerciseModalVisible} exerciseOptions={MOCK_EXERCISE_OPTIONS} selectedExercises={selectedExercises} onClose={() => setExerciseModalVisible(false)} onSelectionChange={setSelectedExercises} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { padding: 16 },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  stepDotWrap: { alignItems: 'center', opacity: 0.5, flex: 1 },
  stepDotWrapActive: { opacity: 1 },
  stepDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 4 },
  stepLabel: { fontSize: 12 },
  stepLabelActive: { fontWeight: '700' },
  card: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 14 },
  cardTitle: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  col: { flex: 1 },
  spacer: { width: 12 },
  label: { marginBottom: 6, fontSize: 13 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 10 : 8, fontSize: 16 },
  inputError: {},
  error: { marginTop: 6, fontSize: 12 },
  dateTimePickerContainer: { borderRadius: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'transparent' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inputGlucose: { flex: 1, fontSize: 24, fontWeight: 'bold' },
  nudgeBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  nudgeText: { fontSize: 24, fontWeight: 'bold', lineHeight: 28 },
  segmentedControl: { flexDirection: 'row', borderWidth: 1, borderRadius: 10, overflow: 'hidden' },
  segmentButton: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  segmentText: { fontSize: 16, fontWeight: '600' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 4 },
  navBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  navBtnDisabled: { opacity: 0.5 },
  navText: { fontSize: 16, fontWeight: '700' },
  saveBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
  },
});

