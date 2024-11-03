import React from 'react';
import { View, TouchableOpacity, Text, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles';

function AlertMap({ route, navigation }) {
  const { alert } = route.params;

  // Parse the dates back to Date objects if needed
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: alert.latitude,
          longitude: alert.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{
            latitude: alert.latitude,
            longitude: alert.longitude,
          }}
          title={`Emergency: ${alert.user}`}
          description={`Alert Time: ${formatDate(alert.timestamp)}`}
        />
      </MapView>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#1a237e" />
        <Text style={styles.backButtonText}>Back to Alerts</Text>
      </TouchableOpacity>
    </View>
  );
}

export default AlertMap;
