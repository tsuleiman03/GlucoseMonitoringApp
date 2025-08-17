// app/master-data/fooditem.tsx

// Version: 2.1.0
// Date: 2025-08-17
// Changes: 
// - CHANGE: Updated API_BASE_URL to use machine IP (192.168.178.33) for mobile device access
// - Previous: Replaced direct database calls with HTTP API calls
// - Previous: Updated to use fetch() instead of @/services/database imports
// - Previous: Added proper error handling for network requests
// - Previous: Updated interfaces to match API response format with UUID
// - Previous: Added loading states and error handling for HTTP requests
// - Previous: Tested and verified with working API endpoints
// - Previous: Integrated with PostgreSQL database service

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { AppHeader } from '@/components/AppHeader';
import { MasterDataList } from '@/components/MasterDataList';

// API Base URL - using machine IP address for mobile device access
const API_BASE_URL = 'http://192.168.178.33:3000/api';

// Interface matching the API response format
interface APIFoodItem {
  id: string; // UUID from API
  name: string;
  active: boolean;
  created_at: string;
  created_by: string;
  modified_at: string;
  modified_by: string;
}

// HTTP API service functions
const foodItemAPI = {
  // GET /api/fooditems
  async getAll(): Promise<APIFoodItem[]> {
    const response = await fetch(`${API_BASE_URL}/fooditems`);
    if (!response.ok) {
      throw new Error(`Failed to fetch food items: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  // POST /api/fooditems
  async create(name: string): Promise<APIFoodItem> {
    const response = await fetch(`${API_BASE_URL}/fooditems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: name.trim(),
        created_by: 'react-native-app'
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create food item: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  // PUT /api/fooditems/:id
  async update(id: string, name: string): Promise<APIFoodItem> {
    const response = await fetch(`${API_BASE_URL}/fooditems/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        name: name.trim(),
        modified_by: 'react-native-app'
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update food item: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  // DELETE /api/fooditems/:id (soft delete)
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/fooditems/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modified_by: 'react-native-app'
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete food item: ${response.status} ${response.statusText}`);
    }
  },
};

export default function FoodItemScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [foodItems, setFoodItems] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Load food items from API on component mount
  useEffect(() => {
    loadFoodItems();
  }, []);

  const loadFoodItems = async () => {
    try {
      setLoading(true);
      const items = await foodItemAPI.getAll();
      // Convert API response to component format
      const formattedItems = items.map(item => ({
        id: item.id, // Already a UUID string from API
        name: item.name
      }));
      setFoodItems(formattedItems);
    } catch (error) {
      console.error('Failed to load food items:', error);
      Alert.alert(
        'Connection Error', 
        'Failed to load food items from server. Please ensure the API server is running on localhost:3000.',
        [
          { text: 'Retry', onPress: loadFoodItems },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (name: string) => {
    try {
      const newItem = await foodItemAPI.create(name);
      const formattedItem = {
        id: newItem.id, // UUID from API
        name: newItem.name
      };
      setFoodItems([...foodItems, formattedItem]);
    } catch (error) {
      console.error('Failed to add food item:', error);
      Alert.alert(
        'Error', 
        'Failed to add food item. Please check your connection and try again.'
      );
    }
  };

  const handleUpdateItem = async (id: string, newName: string) => {
    try {
      const updatedItem = await foodItemAPI.update(id, newName);
      setFoodItems(foodItems.map(item => 
        item.id === id ? { id: updatedItem.id, name: updatedItem.name } : item
      ));
    } catch (error) {
      console.error('Failed to update food item:', error);
      Alert.alert(
        'Error', 
        'Failed to update food item. Please check your connection and try again.'
      );
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await foodItemAPI.delete(id);
      setFoodItems(foodItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete food item:', error);
      Alert.alert(
        'Error', 
        'Failed to delete food item. Please check your connection and try again.'
      );
    }
  };

  if (loading) {
    // You might want to add a proper loading component here
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.background }]}>
        <AppHeader title="Food Items" />
        <View style={styles.container}>
          {/* Add loading indicator here if needed */}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.background }]}>
      <AppHeader title="Food Items" />
      
      <View style={styles.container}>
        <MasterDataList
          items={foodItems}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
});