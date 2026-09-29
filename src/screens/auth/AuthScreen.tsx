import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AuthScreen: React.FC = () => {
  const { login, signup, role, setRole } = useApp();

  // Screen modes: 'role_select' | 'signin' | 'signup'
  const [authStep, setAuthStep] = useState<'role_select' | 'signin' | 'signup'>('role_select');
  const [selectedRole, setSelectedRole] = useState<UserRole>(role || 'STUDENT');

  // Sign In Form States
  const [signinIdentifier, setSigninIdentifier] = useState('soosaketxd@gmail.com');
  const [signinPassword, setSigninPassword] = useState('password123');
  const [showSigninPassword, setShowSigninPassword] = useState(false);

  // Sign Up Form States
  const [signupFullName, setSignupFullName] = useState('soo saket');
  const [signupRegNo, setSignupRegNo] = useState('25155150044');
  const [signupSession, setSignupSession] = useState('2025-2029');
  const [signupBranch, setSignupBranch] = useState('CSE(IOT)');
  const [signupPhone, setSignupPhone] = useState('9786756450');
  const [signupEmail, setSignupEmail] = useState('soosaketxd@gmail.com');
  const [signupPassword, setSignupPassword] = useState('password123');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('password123');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  const branchOptions = [
    'CSE(IOT)',
    'Computer Science & Engg (CSE)',
    'Mechanical Engineering (ME)',
    'Civil Engineering (CE)',
    'Electrical Engineering (EE)',
  ];

  const handleRoleContinue = () => {
    setRole(selectedRole);
    if (selectedRole === 'TEACHER') {
      setSigninIdentifier('FAC-CSE-104');
      setSignupRegNo('FAC-CSE-104');
      setSignupFullName('Dr. Rajiv Sharma');
      setSignupEmail('r.sharma@gecm.edu.in');
    } else {
      setSigninIdentifier('25155150044');
      setSignupRegNo('25155150044');
      setSignupFullName('soo saket');
      setSignupEmail('soosaketxd@gmail.com');
    }
    setAuthStep('signin');
  };

  const handleSignIn = () => {
    if (!signinIdentifier.trim() || !signinPassword.trim()) {
      Alert.alert('Required Fields', 'Please enter your Registration No. / Email and Password.');
      return;
    }
    login(signinIdentifier, signinPassword, selectedRole);
  };

  const handleSignUp = () => {
    if (!signupFullName.trim() || !signupRegNo.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      Alert.alert('Incomplete Form', 'Please complete all required fields.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      Alert.alert('Password Mismatch', 'Set Password and Confirm Password do not match.');
      return;
    }

    signup({
      fullName: signupFullName,
      regNo: signupRegNo,
      session: signupSession,
      branch: signupBranch,
      phone: signupPhone,
      email: signupEmail,
      password: signupPassword,
      role: selectedRole,
    });
  };

  const handleQuickDemoFill = (roleToFill: UserRole) => {
    setSelectedRole(roleToFill);
    setRole(roleToFill);
    if (roleToFill === 'STUDENT') {
      setSigninIdentifier('25155150044');
      setSigninPassword('password123');
    } else {
      setSigninIdentifier('FAC-CSE-104');
      setSigninPassword('password123');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Navigation Back Header if on signin or signup */}
        <View style={styles.topNavRow}>
          {authStep !== 'role_select' ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (authStep === 'signup') {
                  setAuthStep('signin');
                } else {
                  setAuthStep('role_select');
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24, height: 24 }} />
          )}
        </View>

        {/* Official College Emblem & Name (present in all screenshots) */}
        <View style={styles.collegeHeader}>
          <Image
            source={require('../../../assets/college_emblem.jpg')}
            style={styles.emblemImage}
            resizeMode="contain"
          />
          <Text style={styles.collegeNameBold}>Government Engineering College</Text>
          <Text style={styles.collegeLocation}>Madhubani</Text>
        </View>

        {/* STEP 1: ROLE SELECTION VIEW ("Are you a") */}
        {authStep === 'role_select' && (
          <View style={styles.roleSelectContainer}>
            <Text style={styles.mainHeading}>Are you a</Text>
            <Text style={styles.subHeading}>Select any of these to continue</Text>

            {/* Student Card */}
            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === 'STUDENT' && styles.selectedRoleCard,
              ]}
              onPress={() => setSelectedRole('STUDENT')}
              activeOpacity={0.8}
            >
              <View style={styles.roleCardLeft}>
                <Image
                  source={require('../../../assets/student_avatar.jpg')}
                  style={styles.roleIllustration}
                  resizeMode="contain"
                />
                <Text style={styles.roleTitleText}>Student</Text>
              </View>

              <View
                style={[
                  styles.checkCircle,
                  selectedRole === 'STUDENT' && styles.activeCheckCircle,
                ]}
              >
                {selectedRole === 'STUDENT' && (
                  <Ionicons name="checkmark" size={15} color="#FFF" />
                )}
              </View>
            </TouchableOpacity>

            {/* Teacher Card */}
            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === 'TEACHER' && styles.selectedRoleCard,
              ]}
              onPress={() => setSelectedRole('TEACHER')}
              activeOpacity={0.8}
            >
              <View style={styles.roleCardLeft}>
                <Image
                  source={require('../../../assets/teacher_avatar.jpg')}
                  style={styles.roleIllustration}
                  resizeMode="contain"
                />
                <Text style={styles.roleTitleText}>Teacher</Text>
              </View>

              <View
                style={[
                  styles.checkCircle,
                  selectedRole === 'TEACHER' && styles.activeCheckCircle,
                ]}
              >
                {selectedRole === 'TEACHER' && (
                  <Ionicons name="checkmark" size={15} color="#FFF" />
                )}
              </View>
            </TouchableOpacity>

            {/* Continue Button */}
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={handleRoleContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryActionButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: SIGN IN VIEW ("Sign in to your Account") */}
        {authStep === 'signin' && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Sign in to your Account</Text>
            <Text style={styles.formSubtitle}>
              Enter your {selectedRole === 'STUDENT' ? 'registration no. / email' : 'faculty ID / email'} and password to log in
            </Text>

            {/* Registration No. / Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>
                {selectedRole === 'STUDENT' ? 'Registration No. / Email' : 'Faculty ID / Email'}
              </Text>
              <TextInput
                style={styles.textInputField}
                value={signinIdentifier}
                onChangeText={setSigninIdentifier}
                placeholder={selectedRole === 'STUDENT' ? 'e.g. 25155150044 or email' : 'e.g. FAC-CSE-104 or email'}
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.passwordFieldRow}>
                <TextInput
                  style={styles.passwordInput}
                  value={signinPassword}
                  onChangeText={setSigninPassword}
                  secureTextEntry={!showSigninPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textMuted}
                />
                <TouchableOpacity
                  onPress={() => setShowSigninPassword(!showSigninPassword)}
                  style={styles.eyeIconBtn}
                >
                  <Ionicons
                    name={showSigninPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordRow}
              onPress={() => Alert.alert('Password Reset', 'A password reset instructions link will be sent to your registered college email.')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
            </TouchableOpacity>

            {/* Quick Demo Fill Helper */}
            <View style={styles.quickFillBox}>
              <Text style={styles.quickFillLabel}>1-Tap Demo Credentials:</Text>
              <View style={styles.quickFillChips}>
                <TouchableOpacity
                  style={[styles.quickFillChip, selectedRole === 'STUDENT' && styles.activeQuickChip]}
                  onPress={() => handleQuickDemoFill('STUDENT')}
                >
                  <Text style={[styles.quickFillChipText, selectedRole === 'STUDENT' && styles.activeQuickChipText]}>
                    Student Demo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.quickFillChip, selectedRole === 'TEACHER' && styles.activeQuickChip]}
                  onPress={() => handleQuickDemoFill('TEACHER')}
                >
                  <Text style={[styles.quickFillChipText, selectedRole === 'TEACHER' && styles.activeQuickChipText]}>
                    Faculty Demo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Log In Button */}
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={handleSignIn}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryActionButtonText}>Log In</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Continue with Google */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={() => {
                login(signinIdentifier || 'google_user@gecm.edu.in', 'google_auth', selectedRole);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={18} color="#EA4335" style={{ marginRight: 8 }} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Footer Sign Up Link */}
            <View style={styles.footerPromptRow}>
              <Text style={styles.footerPromptText}>{"Don't have an account? "}</Text>
              <TouchableOpacity onPress={() => setAuthStep('signup')}>
                <Text style={styles.footerLinkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 3: SIGN UP VIEW ("Sign up") */}
        {authStep === 'signup' && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Sign up</Text>
            <Text style={styles.formSubtitle}>Create an account to continue!</Text>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.textInputField}
                value={signupFullName}
                onChangeText={setSignupFullName}
                placeholder="Enter full name"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Registration No. */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>
                {selectedRole === 'STUDENT' ? 'Registration No.' : 'Faculty / Employee ID'}
              </Text>
              <TextInput
                style={styles.textInputField}
                value={signupRegNo}
                onChangeText={setSignupRegNo}
                placeholder={selectedRole === 'STUDENT' ? 'e.g. 25155150044' : 'e.g. FAC-CSE-104'}
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Session & Branch Row */}
            <View style={styles.twoColumnRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.fieldLabel}>Session</Text>
                <View style={styles.iconInputRow}>
                  <TextInput
                    style={styles.iconInputText}
                    value={signupSession}
                    onChangeText={setSignupSession}
                    placeholder="2025-2029"
                    placeholderTextColor={colors.textMuted}
                  />
                  <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
                </View>
              </View>

              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.fieldLabel}>Branch</Text>
                <TouchableOpacity
                  style={styles.iconInputRow}
                  onPress={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.iconInputText} numberOfLines={1}>
                    {signupBranch}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Branch Dropdown selector if toggled */}
            {isBranchDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {branchOptions.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.dropdownMenuItem}
                    onPress={() => {
                      setSignupBranch(item);
                      setIsBranchDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        signupBranch === item && styles.activeDropdownItemText,
                      ]}
                    >
                      {item}
                    </Text>
                    {signupBranch === item && (
                      <Ionicons name="checkmark" size={16} color={colors.primaryLight} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Phone Number with India Flag */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <View style={styles.phoneInputRow}>
                <View style={styles.flagCountryCode}>
                  <Text style={styles.flagEmoji}>🇮🇳</Text>
                  <Ionicons name="chevron-down" size={12} color={colors.textSecondary} style={{ marginLeft: 4 }} />
                </View>
                <View style={styles.phoneDivider} />
                <TextInput
                  style={styles.phoneTextInput}
                  value={signupPhone}
                  onChangeText={setSignupPhone}
                  placeholder="9876543210"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={styles.textInputField}
                value={signupEmail}
                onChangeText={setSignupEmail}
                placeholder="your.email@gecm.edu.in"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Set Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Set Password</Text>
              <View style={styles.passwordFieldRow}>
                <TextInput
                  style={styles.passwordInput}
                  value={signupPassword}
                  onChangeText={setSignupPassword}
                  secureTextEntry={!showSignupPassword}
                  placeholder="Set account password"
                  placeholderTextColor={colors.textMuted}
                />
                <TouchableOpacity
                  onPress={() => setShowSignupPassword(!showSignupPassword)}
                  style={styles.eyeIconBtn}
                >
                  <Ionicons
                    name={showSignupPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Confirm Password</Text>
              <View style={styles.passwordFieldRow}>
                <TextInput
                  style={styles.passwordInput}
                  value={signupConfirmPassword}
                  onChangeText={setSignupConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor={colors.textMuted}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIconBtn}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.primaryActionButton, { marginTop: 12 }]}
              onPress={handleSignUp}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryActionButtonText}>Register</Text>
            </TouchableOpacity>

            {/* Footer Back to Login Link */}
            <View style={styles.footerPromptRow}>
              <Text style={styles.footerPromptText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => setAuthStep('signin')}>
                <Text style={styles.footerLinkText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  topNavRow: {
    height: 40,
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  collegeHeader: {
    alignItems: 'center',
    marginBottom: 26,
    marginTop: 4,
  },
  emblemImage: {
    width: 84,
    height: 84,
    marginBottom: 10,
  },
  collegeNameBold: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  collegeLocation: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginTop: 2,
  },
  roleSelectContainer: {
    marginTop: 10,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    ...shadows.soft,
  },
  selectedRoleCard: {
    borderColor: '#2563EB',
    backgroundColor: '#F8FAFF',
  },
  roleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIllustration: {
    width: 62,
    height: 62,
    marginRight: 16,
  },
  roleTitleText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#334155',
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCheckCircle: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  primaryActionButton: {
    backgroundColor: '#2563EB',
    borderRadius: borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    ...shadows.soft,
  },
  primaryActionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  formContainer: {
    marginTop: 4,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  textInputField: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0F172A',
  },
  passwordFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0F172A',
  },
  eyeIconBtn: {
    padding: 6,
  },
  forgotPasswordRow: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  forgotPasswordText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
  },
  quickFillBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.md,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickFillLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  quickFillChips: {
    flexDirection: 'row',
    gap: 8,
  },
  quickFillChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    backgroundColor: '#E2E8F0',
  },
  activeQuickChip: {
    backgroundColor: '#2563EB',
  },
  quickFillChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  activeQuickChipText: {
    color: '#FFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingVertical: 12,
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  footerPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  footerPromptText: {
    fontSize: 13,
    color: '#64748B',
  },
  footerLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  twoColumnRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  iconInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  iconInputText: {
    fontSize: 13,
    color: '#0F172A',
    flex: 1,
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: borderRadius.md,
    paddingVertical: 4,
    marginBottom: 12,
    ...shadows.soft,
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemText: {
    fontSize: 12,
    color: '#334155',
  },
  activeDropdownItemText: {
    fontWeight: '700',
    color: '#2563EB',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingHorizontal: 10,
  },
  flagCountryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 6,
  },
  flagEmoji: {
    fontSize: 18,
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  phoneTextInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0F172A',
  },
});
