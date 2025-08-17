// app/master-data/effortlevel.tsx

// Version: 2.0.0
// Date: 2025-08-17
// Changes: 
// - CHANGE: Replaced mock data with HTTP API calls to effortlevel endpoints
// - CHANGE: Added proper error handling for network requests
// - CHANGE: Updated interfaces to match API response format with UUID
// - CHANGE: Added loading states and error handling for HTTP requests
// - Previous: Initial creation of Effort Levels CRUD screen

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
interface APIEffortLevel {
  id: string; // UUID from API
  name: string;
  active: boolean;
  created_at: string;
  created_by: string;
  modified_at: string;
  modified_by: string;
}

// HTTP API service functions
const effortLevelAPI = {
  // GET /api/effortlevels
  async getAll(): Promise<APIEffortLevel[]> {
    const response = await fetch(`${API_BASE_URL}/effortlevels`);
    if (!response.ok) {
      throw new Error(`Failed to fetch effort levels: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  // POST /api/effortlevels
  async create(name: string): Promise<APIEffortLevel> {
    const response = await fetch(`${API_BASE_URL}/effortlevels`, {
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
      throw new Error(`Failed to create effort level: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  // PUT /api/effortlevels/:id
  async update(id: string, name: string): Promise<APIEffortLevel> {
    const response = await fetch(`${API_BASE_URL}/effortlevels/${id}`, {
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
      throw new Error(`Failed to update effort level: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  // DELETE /api/effortlevels/:id (soft delete)
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/effortlevels/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modified_by: 'react-native-app'
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete effort level: ${response.status} ${response.statusText}`);
    }
  },
};

export default function EffortLevelScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [effortLevels, setEffortLevels] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Load effort levels from API on component mount
  useEffect(() => {
    loadEffortLevels();
  }, []);

  const loadEffortLevels = async () => {
    try {
      setLoading(true);
      const items = await effortLevelAPI.getAll();
      // Convert API response to component format
      const formattedItems = items.map(item => ({
        id: item.id, // Already a UUID string from API
        name: item.name
      }));
      setEffortLevels(formattedItems);
    } catch (error) {
      console.error('Failed to load effort levels:', error);
      Alert.alert(
        'Connection Error', 
        'Failed to load effort levels from server. Please ensure the API server is running on 192.168.178.33:3000.',
        [
          { text: 'Retry', onPress: loadEffortLevels },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (name: string) => {
    try {
      const newItem = await effortLevelAPI.create(name);
      const formattedItem = {
        id: newItem.id, // UUID from API
        name: newItem.name
      };
      setEffortLevels([...effortLevels, formattedItem]);
    } catch (error) {
      console.error('Failed to add effort level:', error);
      Alert.alert(
        'Error', 
        'Failed to add effort level. Please check your connection and try again.'
      );
    }
  };

  const handleUpdateItem = async (id: string, newName: string) => {
    try {
      const updatedItem = await effortLevelAPI.update(id, newName);
      setEffortLevels(effortLevels.map(item => 
        item.id === id ? { id: updatedItem.id, name: updatedItem.name } : item
      ));
    } catch (error) {
      console.error('Failed to update effort level:', error);
      Alert.alert(
        'Error', 
        'Failed to update effort level. Please check your connection and try again.'
      );
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await effortLevelAPI.delete(id);
      setEffortLevels(effortLevels.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete effort level:', error);
      Alert.alert(
        'Error', 
        'Failed to delete effort level. Please check your connection and try again.'
      );
    }
  };

  if (loading) {
    // You might want to add a proper loading component here
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.background }]}>
        <AppHeader title="Effort Levels" />
        <View style={styles.container}>
          {/* Add loading indicator here if needed */}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: themeColors.background }]}>
      <AppHeader title="Effort Levels" />
      
      <View style={styles.container}>
        <MasterDataList
          items={effortLevels}
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