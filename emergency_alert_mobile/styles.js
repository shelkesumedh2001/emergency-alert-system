import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutButtonText: {
    color: '#d32f2f',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 20,
    zIndex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  emergencyButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  emergencyGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  disabled: {
    opacity: 0.7,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  titleWhite: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitleWhite: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  inputIcon: {
    marginRight: 10,
    width: 24,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    height: '100%',
  },
  picker: {
    flex: 1,
    color: '#FFFFFF',
    height: 50,
  },
  loginButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
  },
  registerLink: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  noAlertsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noAlertsText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButtonText: {
    color: '#1a237e',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  securityContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  securityHeader: {
    backgroundColor: '#1a237e',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  securityTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  alertsList: {
    flex: 1,
    padding: 16,
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  alertInfo: {
    marginBottom: 12,
  },
  alertUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertUser: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginLeft: 8,
  },
  alertTime: {
    color: '#666',
    fontSize: 14,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a237e',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
    justifyContent: 'center',
  },
  directionsButton: {
    backgroundColor: '#4caf50',
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginVertical: 16,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  acknowledgeButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
  },
  acknowledgeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    },
  acknowledgedAlert: {
    opacity: 0.8,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  acknowledgedBadge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  acknowledgedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  acknowledgedTime: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  securityLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 8,
  },
  securityLogoutText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  }
});