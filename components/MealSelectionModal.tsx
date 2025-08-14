// components/MealSelectionModal.tsx

// Version: 1.1.0
// Date: 2025-08-10
// Changes: Added "Clear All" and individual delete buttons inside the modal.

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

export interface MealItem {
  id: string;
  name: string;
  portion: 'small' | 'medium' | 'large';
}

interface Props {
  visible: boolean;
  mealOptions: MealItem[];
  selectedMeals: MealItem[];
  onClose: () => void;
  onSelectionChange: (selected: MealItem[]) => void;
}

export function MealSelectionModal({ visible, mealOptions, selectedMeals, onClose, onSelectionChange }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const handleSelect = (item: MealItem) => {
    const isSelected = selectedMeals.some(m => m.id === item.id);
    let newSelection;
    if (isSelected) {
      newSelection = selectedMeals.filter(m => m.id !== item.id);
    } else {
      newSelection = [...selectedMeals, item];
    }
    onSelectionChange(newSelection);
  };

  // --- MODIFICATION: Function to clear all selections ---
  const handleClearAll = () => {
    onSelectionChange([]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>Select Meal Items</Text>
          {/* --- MODIFICATION: Added "Clear All" button --- */}
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
            <Pressable onPress={handleClearAll}>
              <Text style={[styles.clearButton, { color: themeColors.error }]}>Clear All</Text>
            </Pressable>
            <Pressable onPress={onClose}>
              <Text style={[styles.doneButton, { color: themeColors.tint }]}>Done</Text>
            </Pressable>
          </View>
        </View>
        <ScrollView>
          {mealOptions.map(item => {
            const isSelected = selectedMeals.some(m => m.id === item.id);
            return (
              <Pressable key={item.id} style={styles.itemContainer} onPress={() => handleSelect(item)}>
                <View style={[styles.checkbox, { borderColor: themeColors.tint }, isSelected && { backgroundColor: themeColors.tint }]}>
                  {isSelected && <Text style={{ color: themeColors.background }}>✓</Text>}
                </View>
                <Text style={[styles.itemText, { color: themeColors.text }]}>{`${item.name} [${item.portion}]`}</Text>
                <View style={{flex: 1}} />
                {/* --- MODIFICATION: Added individual delete button --- */}
                {isSelected && (
                  <Pressable style={styles.deleteButton} onPress={() => handleSelect(item)}>
                    <Text style={{color: themeColors.error, fontSize: 18}}>✕</Text>
                  </Pressable>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  doneButton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
  },
  deleteButton: {
    paddingLeft: 16,
  }
});

