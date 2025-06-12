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

const ForgotPasswordPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [stage, setStage] = useState<'request' | 'reset'>('request');
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  // Form validation states
  const [phoneError, setPhoneError] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

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
      toValue: stage === 'request' ? 0.5 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [stage]);

  // Validation functions
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

  const validateOtp = (otp: string) => {
    if (!otp) {
      setOtpError('OTP is required');
      return false;
    }
    if (otp.length !== 4) {
      setOtpError('OTP must be 4 digits');
      return false;
    }
    setOtpError('');
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

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (confirmPassword !== newPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: '', color: '#e0e0e0' };
    if (password.length < 6) return { strength: 1, text: 'Weak', color: '#ff6b6b' };
    if (password.length < 8) return { strength: 2, text: 'Fair', color: '#ffa726' };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 2, text: 'Fair', color: '#ffa726' };
    return { strength: 3, text: 'Strong', color: '#66bb6a' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleRequestOtp = async () => {
    if (!validatePhone(phone)) {
      shakeAnimation();
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'http://192.168.30.216:8000/auth/forgot-password',
        { phone_number: phone },
        { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
      );
      Alert.alert('OTP Sent! 📱', `Verification code has been sent to +91-${phone}`);
      setStage('reset');
    } catch (error: any) {
      const msg = error.response?.data?.detail || error.message || 'Could not send OTP. Please try again.';
      Alert.alert('Error 😞', msg);
      shakeAnimation();
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const isOtpValid = validateOtp(otp);
    const isPasswordValid = validatePassword(newPassword);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isOtpValid || !isPasswordValid || !isConfirmPasswordValid) {
      shakeAnimation();
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'http://192.168.30.216:8000/auth/reset-password',
        { phone_number: phone, otp, new_password: newPassword },
        { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
      );
      Alert.alert('Success! 🎉', 'Password reset successful! You can now log in with your new password.');
      navigation.navigate('login');
    } catch (error: any) {
      const msg = error.response?.data?.detail || error.message || 'Reset failed. Please try again.';
      Alert.alert('Error 😞', msg);
      shakeAnimation();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(
        'http://192.168.30.216:8000/auth/forgot-password',
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
                  transform: [
                    { translateY: slideAnim },
                    { translateX: shakeAnim }
                  ],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                
                <View style={styles.logoContainer}>
                  <Icon 
                    name={stage === 'request' ? "key" : "shield-checkmark"} 
                    size={40} 
                    color="#fff" 
                  />
                </View>
                
                <Text style={styles.title}>
                  {stage === 'request' ? 'Forgot Password?' : 'Create New Password'}
                </Text>
              </View>

              {/* Form Container */}
              <View style={styles.formContainer}>
                {stage === 'request' ? (
                  <>
                    {/* Phone Input */}
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Mobile Number</Text>
                      <View style={[styles.inputContainer, phoneError && styles.inputError]}>
                        <Icon name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                        <View style={styles.phoneContainer}>
                          <Text style={styles.countryCode}>+91</Text>
                          <TextInput
                            style={styles.phoneInput}
                            placeholder="Enter your mobile number"
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
                      <Text style={styles.helperText}>
                        We'll send a verification code to this number
                      </Text>
                    </View>

                    {/* Send OTP Button */}
                    <TouchableOpacity
                      style={[styles.actionButton, loading && styles.actionButtonDisabled]}
                      onPress={handleRequestOtp}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={loading ? ['#ccc', '#999'] : ['#667eea', '#764ba2']}
                        style={styles.actionButtonGradient}
                      >
                        {loading ? (
                          <View style={styles.loadingContainer}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[styles.actionButtonText, { marginLeft: 10 }]}>Sending...</Text>
                          </View>
                        ) : (
                          <View style={styles.buttonContent}>
                            <Icon name="send" size={20} color="#fff" />
                            <Text style={[styles.actionButtonText, { marginLeft: 8 }]}>Send OTP</Text>
                          </View>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* Phone Display */}
                    <View style={styles.phoneDisplayContainer}>
                      <Icon name="checkmark-circle" size={20} color="#66bb6a" />
                      <Text style={styles.phoneDisplayText}>+91-{phone}</Text>
                      <TouchableOpacity onPress={() => setStage('request')}>
                        <Text style={styles.editPhoneText}>Edit</Text>
                      </TouchableOpacity>
                    </View>

                    {/* OTP Input */}
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Verification Code</Text>
                      <View style={[styles.inputContainer, otpError && styles.inputError]}>
                        <Icon name="keypad-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter 6-digit code"
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

                    {/* New Password Input */}
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>New Password</Text>
                      <View style={[styles.inputContainer, passwordError && styles.inputError]}>
                        <Icon name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter new password"
                          placeholderTextColor="#999"
                          secureTextEntry={!showPassword}
                          value={newPassword}
                          onChangeText={(text) => {
                            setNewPassword(text);
                            if (passwordError) validatePassword(text);
                            if (confirmPassword && confirmPasswordError) validateConfirmPassword(confirmPassword);
                          }}
                          onBlur={() => validatePassword(newPassword)}
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
                      {newPassword.length > 0 && (
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

                    {/* Confirm Password Input */}
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Confirm Password</Text>
                      <View style={[styles.inputContainer, confirmPasswordError && styles.inputError]}>
                        <Icon name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Confirm new password"
                          placeholderTextColor="#999"
                          secureTextEntry={!showConfirmPassword}
                          value={confirmPassword}
                          onChangeText={(text) => {
                            setConfirmPassword(text);
                            if (confirmPasswordError) validateConfirmPassword(text);
                          }}
                          onBlur={() => validateConfirmPassword(confirmPassword)}
                        />
                        <TouchableOpacity
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={styles.eyeIcon}
                        >
                          <Icon
                            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#666"
                          />
                        </TouchableOpacity>
                      </View>
                      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                    </View>

                    {/* Reset Password Button */}
                    <TouchableOpacity
                      style={[styles.actionButton, loading && styles.actionButtonDisabled]}
                      onPress={handleResetPassword}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={loading ? ['#ccc', '#999'] : ['#66bb6a', '#4caf50']}
                        style={styles.actionButtonGradient}
                      >
                        {loading ? (
                          <View style={styles.loadingContainer}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={[styles.actionButtonText, { marginLeft: 10 }]}>Resetting...</Text>
                          </View>
                        ) : (
                          <View style={styles.buttonContent}>
                            <Icon name="checkmark-circle" size={20} color="#fff" />
                            <Text style={[styles.actionButtonText, { marginLeft: 8 }]}>Reset Password</Text>
                          </View>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>

                    {/* Back Button */}
                    <TouchableOpacity
                      style={styles.backToRequestButton}
                      onPress={() => setStage('request')}
                    >
                      <Icon name="arrow-back" size={20} color="#667eea" />
                      <Text style={styles.backToRequestText}>Change Phone Number</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Login Link */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Remember your password? </Text>
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
                  Step {stage === 'request' ? '1' : '2'} of 2
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
};

export default ForgotPasswordPage;

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
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 10,
    zIndex: 1,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  progressContainer: {
    marginTop: 20,
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
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
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    marginLeft: 5,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  phoneDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#66bb6a',
  },
  phoneDisplayText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    fontWeight: '600',
  },
  editPhoneText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
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
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    color: '#666',
    fontSize: 14,
  },
  resendLink: {
    color: '#667eea',
    fontWeight: '600',
  },
  actionButton: {
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#667eea',
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backToRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  backToRequestText: {
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