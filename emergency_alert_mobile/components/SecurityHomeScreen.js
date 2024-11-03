import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { styles } from '../styles';
import { API_URL } from '../config';

function SecurityHomeScreen() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState();
  const [newAlert, setNewAlert] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const navigation = useNavigation();
  const pollingInterval = useRef(null);
  const isMounted = useRef(true);

  const playSOSSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/sos-alarm.mp3'),
        { shouldPlay: true }
      );
      setSound(sound);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleOpenMaps = async (latitude, longitude) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${latitude},${longitude}`;
    const label = 'Emergency Location';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening maps:', error);
      Alert.alert('Error', 'Could not open maps application');
    }
  };

  const navigateToMap = (alert) => {
    const serializedAlert = {
      ...alert,
      timestamp: alert.timestamp,
      acknowledgementTime: alert.acknowledgementTime ? new Date(alert.acknowledgementTime).toISOString() : null,
    };
    navigation.navigate('AlertMap', { alert: serializedAlert });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Intl.DateTimeFormat('en-IN', options).format(date);
  };

  const fetchAlerts = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login');
        return;
      }

      const response = await fetch(`${API_URL}/alerts`, {
        headers: {
          'Authorization': token,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (!isMounted.current) return;

        setAlerts(currentAlerts => {
          const existingIds = new Set(currentAlerts.map(a => a.id));
          const newAlerts = data.filter(alert => !existingIds.has(alert.id));
          
          if (newAlerts.length > 0) {
            setNewAlert(newAlerts[0]);
            setShowAlertModal(true);
            playSOSSound();
          }

          // Keep all alerts and update existing ones
          return data;
        });
      }
    } catch (error) {
      console.error('Fetch alerts error:', error);
    }
  }, [navigation]);

const acknowledgeAlert = async (alertId) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/alert/${alertId}/acknowledge`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        await stopSound();
        setShowAlertModal(false);
        setNewAlert(null);
        
        // Update the specific alert in the state
        setAlerts(currentAlerts => 
          currentAlerts.map(alert => 
            alert.id === alertId 
              ? {
                  ...alert,
                  acknowledged: true,
                  acknowledgementTime: data.acknowledged_at,
                  status: 'resolved',
                }
              : alert
          )
        );

        // Show success message
        Alert.alert('Success', 'Alert acknowledged successfully');
      } else {
        console.error('Acknowledge error:', data.message);
        Alert.alert('Error', data.message || 'Failed to acknowledge alert');
      }
    } catch (error) {
      console.error('Acknowledge error:', error);
      Alert.alert('Error', 'Failed to acknowledge alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;
      fetchAlerts();
      
      pollingInterval.current = setInterval(() => {
        if (isMounted.current) {
          fetchAlerts();
        }
      }, 30000);

      return () => {
        isMounted.current = false;
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
        }
        if (sound) {
          sound.unloadAsync();
        }
      };
    }, [fetchAlerts])
  );

  return (
    <View style={styles.securityContainer}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.securityHeader}>
        <Text style={styles.securityTitle}>Active Alerts</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.securityLogoutButton}>
          <Ionicons name="log-out" size={24} color="white" />
          <Text style={styles.securityLogoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.alertsList}>
        {alerts.length === 0 ? (
          <View style={styles.noAlertsContainer}>
            <Ionicons name="checkmark-circle" size={48} color="#4caf50" />
            <Text style={styles.noAlertsText}>No active alerts</Text>
          </View>
        ) : (
          alerts.map((alert) => (
            <View key={alert.id} style={[
              styles.alertCard,
              alert.acknowledged && styles.acknowledgedAlert
            ]}>
              <View style={styles.alertInfo}>
                <View style={styles.alertUserInfo}>
                  <Ionicons name="person" size={24} color="#1a237e" />
                  <Text style={styles.alertUser}>{alert.user}</Text>
                  {alert.acknowledged && (
                    <View style={styles.acknowledgedBadge}>
                      <Text style={styles.acknowledgedText}>Acknowledged</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.alertTime}>
                  {formatDate(alert.timestamp)}
                </Text>
                {alert.acknowledged && (
                  <Text style={styles.acknowledgedTime}>
                    Acknowledged at: {formatDate(alert.acknowledgementTime)}
                  </Text>
                )}
              </View>
              
              <View style={styles.alertActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => navigateToMap(alert)}
                >
                  <Ionicons name="map" size={20} color="white" />
                  <Text style={styles.actionButtonText}>View on Map</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.directionsButton]}
                  onPress={() => handleOpenMaps(alert.latitude, alert.longitude)}
                >
                  <Ionicons name="navigate" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showAlertModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons name="warning" size={48} color="#d32f2f" />
            <Text style={styles.modalTitle}>New Emergency Alert!</Text>
            {newAlert && (
              <>
                <Text style={styles.modalText}>From: {newAlert.user}</Text>
                <Text style={styles.modalText}>Time: {formatDate(newAlert.timestamp)}</Text>
              </>
            )}
            <TouchableOpacity 
              style={styles.acknowledgeButton}
              onPress={() => newAlert && acknowledgeAlert(newAlert.id)}
            >
              <Text style={styles.acknowledgeButtonText}>Acknowledge Alert</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default SecurityHomeScreen;
