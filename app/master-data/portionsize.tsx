// app/master-data/portionsize.tsx

// Version: 2.0.0
// Date: 2025-08-17
// Changes: 
// - CHANGE: Replaced mock data with HTTP API calls to portionsize endpoints
// - CHANGE: Added proper error handling for network requests
// - CHANGE: Updated interfaces to match API response format with UUID
// - CHANGE: Added loading states and error handling for HTTP requests
// - Previous: Initial creation of Portion Sizes CRUD screen

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
interface APIPortionSize {
  id: string; // UUID from API
  name: string;
  active: boolean;
  created_at: string;
  created_by: string;
  modified_at: string;
  modified_by: string;
}

// HTTP API service functions
const portionSizeAPI = {
  // GET /api/portionsizes
  async getAll(): Promise<APIPortionSize[]> {
    const response = await fetch(`${API_BASE_URL}/portionsizes`);
    if (!response.ok) {
      throw new Error(`Failed to fetch portion sizes: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  // POST /api/portionsizes
  async create(name: string): Promise<APIPortionSize> {
    const response = await fetch(`${API_BASE_URL}/portionsizes`, {
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
      throw new Error(`Failed to create portion size: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  // PUT /api/portionsizes/:id
  async update(id: string, name: string): Promise<APIPortionSize> {
    const response = await fetch(`${API_BASE_URL}/portionsizes/${id}`, {
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
      throw new Error(`Failed to update portion size: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  // DELETE /api/portionsizes/:id (soft delete)
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/portionsizes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modified_by: 'react-native-app'
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete portion size: ${response.status} ${response.statusText}`);
    }
  },
};

export default function PortionSizeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [portionSizes, setPortionSizes] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Load portion sizes from API on component mount
  useEffect(() => {
    loadPortionSizes();
  }, []);

  const loadPortionSizes = async () => {
    try {
      setLoading(true);
      const items = await portionSizeAPI.getAll();
      // Convert API response to component format
      const formattedItems = items.map(item => ({
        id: item.id, // Already a UUID string from API
        name: item.name
      }));
      setPortionSizes(formattedItems);
    } catch (error) {
      console.error('Failed to load portion sizes:', error);
      Alert.alert(
        'Connection Error', 
        'Failed to load portion sizes from server. Please ensure the API server is running on 192.168.178.33:3000.',
        [
          { text: 'Retry', onPress: loadPortionSizes },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (name: string) => {
    try {
      const newItem = await portionSizeAPI.create(name);
      const formattedItem = {
        id: newItem.id, // UUID from API
        name: newItem.name
      };
      setPortionSizes([...portionSizes, formattedItem]);
    } catch (error) {
      console.error('Failed to add portion size:', error);
      Alert.alert(
        'Error', 
        'Failed to add portion size. Please check your connection and try again.'
      );
    }
  };

  const handleUpdateItem = async (id: string, newName: string) => {
    try {
      const updatedItem = await portionSizeAPI.update(id, newName);
      setPortionSizes(portionSizes.map(item => 
        item.id === id ? { id: updatedItem.id, name: updatedItem.name } : item
      ));
    } catch (error) {
      console.error('Failed to update portion size:', error);
      Alert.alert(
        'Error', 
        'Failed to update portion size. Please check your connection and try again.'
      );
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await portionSizeAPI.delete(id);
      setPortionSizes(portionSizes.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete portion size:', error);
      Alert.alert(
        'Error', 
        'Failed to delete portion size. Please check your connection and try again.'
      );
    }
  };

  if (loading) {
    // You might want to add a proper loading component here
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.background }]}>
        <AppHeader title="Portion Sizes" />
        <View style={styles.container}>
          {/* Add loading indicator here if needed */}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.background }]}>
      <AppHeader title="Portion Sizes" />
      
      <View style={styles.container}>
        <MasterDataList
          items={portionSizes}
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