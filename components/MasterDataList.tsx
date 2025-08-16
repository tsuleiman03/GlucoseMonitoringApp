// components/MasterDataList.tsx

// Version: 1.2.0
// Date: 2025-08-16
// Changes: 
// - CHANGE: Implemented inline editing functionality
// - CHANGE: Added edit mode state management
// - CHANGE: Added save/cancel buttons for editing
// - Fixed the "Add" button text color to be visible.
// - Changed the "Add" button background color to be less prominent.
// - Initial creation of the reusable component for master data lists.

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, FlatList } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

interface DataItem {
  id: string;
  name: string;
}

interface MasterDataListProps {
  items: DataItem[];
  onAddItem: (name: string) => void;
  onUpdateItem: (id: string, newName: string) => void;
  onDeleteItem: (id: string) => void;
}

export function MasterDataList({ items, onAddItem, onUpdateItem, onDeleteItem }: MasterDataListProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [newItemName, setNewItemName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAddItem(newItemName.trim());
      setNewItemName('');
    }
  };

  const handleStartEdit = (item: DataItem) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onUpdateItem(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const renderItem = ({ item }: { item: DataItem }) => (
    <ThemedView style={[styles.itemContainer, { borderBottomColor: themeColors.icon }]}>
      {editingId === item.id ? (
        // Edit mode
        <View style={styles.editContainer}>
          <TextInput
            style={[styles.editInput, { 
              color: themeColors.text, 
              backgroundColor: themeColors.background, 
              borderColor: themeColors.tint 
            }]}
            value={editingName}
            onChangeText={setEditingName}
            autoFocus
            selectTextOnFocus
          />
          <View style={styles.editActions}>
            <Pressable onPress={handleSaveEdit} style={[styles.editButton, { backgroundColor: themeColors.tint }]}>
              <IconSymbol name="checkmark" size={18} color={themeColors.background} />
            </Pressable>
            <Pressable onPress={handleCancelEdit} style={[styles.editButton, { backgroundColor: themeColors.icon }]}>
              <IconSymbol name="xmark" size={18} color={themeColors.background} />
            </Pressable>
          </View>
        </View>
      ) : (
        // Display mode
        <>
          <ThemedText style={styles.itemText}>{item.name}</ThemedText>
          <View style={styles.itemActions}>
            <Pressable onPress={() => handleStartEdit(item)}>
              <IconSymbol name="pencil" size={22} color={themeColors.tint} />
            </Pressable>
            <Pressable onPress={() => onDeleteItem(item.id)}>
              <IconSymbol name="trash" size={22} color={themeColors.error} />
            </Pressable>
          </View>
        </>
      )}
    </ThemedView>
  );

  return (
    <View>
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: themeColors.text, backgroundColor: themeColors.background, borderColor: themeColors.icon }]}
          placeholder="Enter new item name..."
          placeholderTextColor={themeColors.icon}
          value={newItemName}
          onChangeText={setNewItemName}
        />
        <Pressable style={[styles.addButton, { backgroundColor: themeColors.icon }]} onPress={handleAddItem}>
          <ThemedText style={[styles.addButtonText, { color: themeColors.background }]}>Add</ThemedText>
        </Pressable>
      </ThemedView>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  addButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    marginTop: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 20,
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editInput: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});