import { Picker } from '@react-native-picker/picker';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const SignupPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [stage, setStage] = useState<'register' | 'verify'>('register');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Form validation states
  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [serviceError, setServiceError] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: stage === 'register' ? 0.5 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [stage]);

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError('Name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('Password must contain uppercase, lowercase, and number');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateService = (service: string) => {
    if (!service) {
      setServiceError('Please select a service');
      return false;
    }
    setServiceError('');
    return true;
  };

  const validateOtp = (otp: string) => {
    if (!otp) {
      setOtpError('OTP is required');
      return false;
    }
    if (otp.length !== 6) {
      setOtpError('OTP must be 6 digits');
      return false;
    }
    setOtpError('');
    return true;
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '#e0e0e0' };
    if (password.length < 6) return { strength: 1, text: 'Weak', color: '#ff6b6b' };
    if (password.length < 8) return { strength: 2, text: 'Fair', color: '#ffa726' };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 2, text: 'Fair', color: '#ffa726' };
    return { strength: 3, text: 'Strong', color: '#66bb6a' };
  };

  const passwordStrength = getPasswordStrength(password);

  const serviceOptions = [
    { label: 'Select service...', value: '' },
    { label: 'Equity Cash', value: 'equity_cash' },
    { label: 'Stock Future', value: 'stock_future' },
    { label: 'Index Future', value: 'index_future' },
    { label: 'Index Option', value: 'index_option' },
    { label: 'Stock Option', value: 'stock_option' },
    { label: 'MCX Bullion', value: 'mcx_bullion' },
    { label: 'MCX Base Metal', value: 'mcx_base_metal' },
    { label: 'MCX Energy', value: 'mcx_energy' },
  ];

  const handleSignUp = async () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);
    const isServiceValid = validateService(service);

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isServiceValid) {
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'http://192.168.30.216:8000/auth/register',
        { name, service, country_code: '+91', phone_number: phone, email, password },
        { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
      );
      Alert.alert('OTP Sent! 📱', `Verification code has been sent to +91-${phone}`);
      setStage('verify');
    } catch (error: any) {
      const msg = error.response?.data?.detail || error.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Failed 😞', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp(otp)) {
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'http://192.168.30.216:8000/auth/verify-otp',
        { phone_number: phone, otp },
        { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
      );
      Alert.alert('Success! 🎉', 'Your account has been verified successfully!');
      navigation.navigate('login');
    } catch (error: any) {
      const msg = error.response?.data?.detail || error.message || 'Invalid OTP. Please try again.';
      Alert.alert('Verification Failed 😞', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(
        'http://192.168.30.216:8000/auth/resend-otp',
        { phone_number: phone },
        { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
      );
      Alert.alert('OTP Resent! 📱', 'A new verification code has been sent to your phone.');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.container}
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <Icon name="person-add" size={40} color="#fff" />
                </View>
                <Text style={styles.title}>
                  {stage === 'register' ? 'Create Account' : 'Verify Phone'}
                </Text>
              </View>

              {/* Form Container */}
              <View style={styles.formContainer}>
                {stage === 'register' ? (
                  <>
                    {/* Name Input */}
                    <View style={styles.inputWrapper}>
                      <View style={[styles.inputContainer, nameError && styles.inputError]}>
                        <Icon name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Full Name"
                          placeholderTextColor="#999"
                          autoCapitalize="words"
                          value={name}
                          onChangeText={(text) => {
                            setName(text);
                            if (nameError) validateName(text);
                          }}
                          onBlur={() => validateName(name)}
                        />
                      </View>
                      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputWrapper}>
                      <View style={[styles.inputContainer, emailError && styles.inputError]}>
                        <Icon name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Email Address"
                          placeholderTextColor="#999"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          value={email}
                          onChangeText={(text) => {
                            setEmail(text);
                            if (emailError) validateEmail(text);
                          }}
                          onBlur={() => validateEmail(email)}
                        />
                      </View>
                      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    </View>

                    {/* Phone Input */}
                    <View style={styles.inputWrapper}>
                      <View style={[styles.inputContainer, phoneError && styles.inputError]}>
                        <Icon name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                        <View style={styles.phoneContainer}>
                          <Text style={styles.countryCode}>+91</Text>
                          <TextInput
                            style={styles.phoneInput}
                            placeholder="Mobile Number"
                            placeholderTextColor="#999"
                            keyboardType="phone-pad"
                            maxLength={10}
                            value={phone}
                            onChangeText={(text) => {
                              setPhone(text.replace(/[^0-9]/g, ''));
                              if (phoneError) validatePhone(text);
                            }}
                            onBlur={() => validatePhone(phone)}
                          />
                        </View>
                      </View>
                      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputWrapper}>
                      <View style={[styles.inputContainer, passwordError && styles.inputError]}>
                        <Icon name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Password"
                          placeholderTextColor="#999"
                          secureTextEntry={!showPassword}
                          value={password}
                          onChangeText={(text) => {
                            setPassword(text);
                            if (passwordError) validatePassword(text);
                          }}
                          onBlur={() => validatePassword(password)}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          style={styles.eyeIcon}
                        >
                          <Icon
                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#666"
                          />
                        </TouchableOpacity>
                      </View>
                      
                      {/* Password Strength Indicator */}
                      {password.length > 0 && (
                        <View style={styles.passwordStrengthContainer}>
                          <View style={styles.strengthBars}>
                            {[1, 2, 3].map((bar) => (
                              <View
                                key={bar}
                                style={[
                                  styles.strengthBar,
                                  {
                                    backgroundColor: bar <= passwordStrength.strength 
                                      ? passwordStrength.color 
                                      : '#e0e0e0'
                                  }
                                ]}
                              />
                            ))}
                          </View>
                          <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                            {passwordStrength.text}
                          </Text>
                        </View>
                      )}
                      
                      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                    </View>

                    {/* Service Picker */}
                    <View style={styles.inputWrapper}>
                      <View style={[styles.pickerContainer, serviceError && styles.inputError]}>
                        <Icon name="briefcase-outline" size={20} color="#666" style={styles.inputIcon} />
                        <Picker
                          selectedValue={service}
                          onValueChange={(value) => {
                            setService(value);
                            if (serviceError) validateService(value);
                          }}
                          style={styles.picker}
                        >
                          {serviceOptions.map((option) => (
                            <Picker.Item 
                              key={option.value} 
                              label={option.label} 
                              value={option.value} 
                            />
                          ))}
                        </Picker>
                      </View>
                      {serviceError ? <Text style={styles.errorText}>{serviceError}</Text> : null}
                    </View>

                    {/* Sign Up Button */}
                    <TouchableOpacity
                      style={[styles.actionButton, loading && styles.actionButtonDisabled]}
                      onPress={handleSignUp}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={loading ? ['#ccc', '#999'] : ['#ff7b7b', '#ff6b6b']}
                        style={styles.actionButtonGradient}
                      >
                        {loading ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          <Text style={styles.actionButtonText}>Create Account</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* OTP Input */}
                    <View style={styles.inputWrapper}>
                      <View style={[styles.inputContainer, otpError && styles.inputError]}>
                        <Icon name="keypad-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter 6-digit OTP"
                          placeholderTextColor="#999"
                          keyboardType="numeric"
                          maxLength={6}
                          value={otp}
                          onChangeText={(text) => {
                            setOtp(text.replace(/[^0-9]/g, ''));
                            if (otpError) validateOtp(text);
                          }}
                          onBlur={() => validateOtp(otp)}
                        />
                      </View>
                      {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
                    </View>

                    {/* Resend OTP */}
                    <TouchableOpacity
                      style={styles.resendContainer}
                      onPress={handleResendOtp}
                      disabled={loading}
                    >
                      <Text style={styles.resendText}>
                        Didn't receive the code? <Text style={styles.resendLink}>Resend OTP</Text>
                      </Text>
                    </TouchableOpacity>

                    {/* Verify Button */}
                    <TouchableOpacity
                      style={[styles.actionButton, loading && styles.actionButtonDisabled]}
                      onPress={handleVerifyOtp}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={loading ? ['#ccc', '#999'] : ['#66bb6a', '#4caf50']}
                        style={styles.actionButtonGradient}
                      >
                        {loading ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          <Text style={styles.actionButtonText}>Verify & Continue</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>

                    {/* Back Button */}
                    <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => setStage('register')}
                    >
                      <Icon name="arrow-back" size={20} color="#667eea" />
                      <Text style={styles.backButtonText}>Edit Details</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Login Link */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('login')}>
                    <Text style={styles.loginLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>


                            {/* Progress Indicator */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  Step {stage === 'register' ? '1' : '2'} of 2
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
};

export default SignupPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  progressBackground: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    height: 55,
  },
  inputError: {
    borderColor: '#ff6b6b',
    backgroundColor: '#fff5f5',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  phoneContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 5,
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  strengthBars: {
    flexDirection: 'row',
    marginRight: 10,
  },
  strengthBar: {
    width: 30,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    paddingLeft: 15,
    height: 55,
  },
  picker: {
    flex: 1,
    height: 55,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  actionButton: {
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#ff6b6b',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  actionButtonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  resendText: {
    color: '#666',
    fontSize: 14,
  },
  resendLink: {
    color: '#667eea',
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '700',
  },
});