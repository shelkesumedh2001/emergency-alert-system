import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../styles';
import { API_URL } from '../config';

function FacultyHomeScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Location permission is required');
        return null;
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return location.coords;
    } catch (error) {
      console.error('Get location error:', error);
      Alert.alert('Error', 'Failed to get location');
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      const location = await getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      }
    })();
  }, []);

  const sendAlert = async () => {
    try {
      setLoading(true);
      
      // Get fresh location data
      const location = await getCurrentLocation();
      if (!location) {
        return; // getCurrentLocation will show appropriate error message
      }

      // Update the current location state
      setCurrentLocation(location);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Not logged in');
        navigation.replace('Login');
        return;
      }

      const response = await fetch(`${API_URL}/alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Emergency alert sent successfully. Help is on the way.');
      } else {
        Alert.alert('Error', data.message || 'Failed to send alert');
      }
    } catch (error) {
      console.error('Send alert error:', error);
      Alert.alert('Error', 'Failed to send alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {currentLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
          />
        </MapView>
      )}
      
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#d32f2f" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.emergencyButton, loading && styles.disabled]}
          onPress={sendAlert}
          disabled={loading}
        >
          <LinearGradient
            colors={['#d32f2f', '#b71c1c']}
            style={styles.emergencyGradient}
          >
            <Ionicons name="warning" size={32} color="white" />
            <Text style={styles.emergencyButtonText}>
              {loading ? 'SENDING ALERT...' : 'SEND EMERGENCY ALERT'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default FacultyHomeScreen;
