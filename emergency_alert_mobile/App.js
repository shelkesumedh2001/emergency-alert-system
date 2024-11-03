import React, { Component, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
  Dimensions,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import FacultyHomeScreen from './components/FacultyHomeScreen.js';
import { styles } from './styles.js';
import { API_URL } from './config.js';
import SecurityHomeScreen from './components/SecurityHomeScreen.js';
import AlertMap from './components/AlertMap.js';
const Stack = createNativeStackNavigator();


function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        navigation.replace('Home');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Login error:', error);  
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1a237e', '#0d47a1']}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Ionicons name="shield-checkmark" size={80} color="white" />
          <Text style={styles.titleWhite}>IIM Bodh Gaya</Text>
          <Text style={styles.subtitleWhite}>Emergency Alert System</Text>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={24} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed" size={24} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerLink}>New user? Register here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('faculty');

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role }),
      });
      
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Registration successful', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Register error:', error);  
      Alert.alert('Error', 'Failed to connect to server');
    }
  };

  return (
    <LinearGradient
      colors={['#1a237e', '#0d47a1']}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.titleWhite}>Register</Text>
          <Text style={styles.subtitleWhite}>Create your account</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="person" size={24} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={24} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed" size={24} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.pickerWrapper}>
            <Ionicons name="people" size={24} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
            <Picker
              selectedValue={role}
              onValueChange={setRole}
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
            >
              <Picker.Item label="Faculty" value="faculty" color="#000000" />
              <Picker.Item label="Security" value="security" color="#000000" />
            </Picker>
          </View>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleRegister}
          >
            <Text style={styles.loginButtonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.registerLink}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}


class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRole: null
    };
  }

  componentDidMount() {
    this.checkUserRole();
  }

  checkUserRole = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/alerts`, {
        headers: {
          'Authorization': token,
        },
      });
      
      if (response.ok) {
        this.setState({ userRole: 'security' });
      } else {
        this.setState({ userRole: 'faculty' });
      }
    } catch (error) {
      console.error('Check role error:', error);
      this.setState({ userRole: 'faculty' });
    }
  };

  render() {
    const { userRole } = this.state;

    if (!userRole) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#1a237e" />
        </View>);
    }

    return userRole === 'security' ? <SecurityHomeScreen /> : <FacultyHomeScreen />;
  }
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a237e',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ 
            headerShown: true,
            title: 'Register',
            headerLeft: (props) => (
              <TouchableOpacity
                onPress={() => props.navigation.goBack()}
                style={{ marginLeft: 10 }}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen 
          name="Home" 
          component={MainScreen}
          options={{ 
            headerShown: true,
            headerLeft: () => null,
            title: 'Emergency Alert',
          }}
        />
        <Stack.Screen 
          name="AlertMap"
          component={AlertMap}
          options={{ 
            headerShown: false,
            title: 'Alert Location',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
