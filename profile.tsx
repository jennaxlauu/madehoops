import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LogOut, RefreshCw } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut, refreshUser } = useAuth();
  const [changingRole, setChangingRole] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!user) return null;

  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();

  const roles = ['staff', 'trainer', 'admin'];

  async function handleChangeRole(newRole: string) {
    if (newRole === user.role) return;

    setChangingRole(true);
    setError('');
    setSuccessMessage('');

    try {
      const { error: updateError } = await supabase
        .from('staff_users')
        .update({ role: newRole })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshUser();
      setSuccessMessage(`Role changed to ${newRole} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to change role');
      console.error(err);
    } finally {
      setChangingRole(false);
    }
  }

  return (
    <LinearGradient colors={['#000000', '#1A1A1A']} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileCircle}>
            <Text style={styles.initialsText}>{initials}</Text>
          </View>

          <Text style={styles.profileName}>
            {user.first_name} {user.last_name}
          </Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Current Role</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Change Role</Text>
            <View style={styles.roleButtons}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleButton,
                    user.role === role && styles.roleButtonActive,
                  ]}
                  onPress={() => handleChangeRole(role)}
                  disabled={changingRole || user.role === role}
                  activeOpacity={0.8}
                >
                  {changingRole ? (
                    <ActivityIndicator color={user.role === role ? '#000000' : '#FFFFFF'} size="small" />
                  ) : (
                    <Text
                      style={[
                        styles.roleButtonText,
                        user.role === role && styles.roleButtonTextActive,
                      ]}
                    >
                      {role}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>First Name</Text>
            <Text style={styles.infoValue}>{user.first_name}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Last Name</Text>
            <Text style={styles.infoValue}>{user.last_name}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={signOut}
          activeOpacity={0.8}
        >
          <LogOut color="#FF3B30" size={20} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    marginTop: 48,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: -0.64,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#333333',
    marginBottom: 16,
  },
  initialsText: {
    fontSize: 40,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    letterSpacing: -0.8,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: -0.56,
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    letterSpacing: -0.32,
  },
  infoSection: {
    gap: 12,
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#999999',
    letterSpacing: -0.24,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    letterSpacing: -0.36,
  },
  roleBadge: {
    backgroundColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    letterSpacing: -0.32,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#FF3B30',
    letterSpacing: -0.32,
  },
  errorText: {
    backgroundColor: '#FF3B30',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    letterSpacing: -0.28,
  },
  successText: {
    backgroundColor: '#34C759',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    letterSpacing: -0.28,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  roleButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    letterSpacing: -0.28,
    textTransform: 'capitalize',
  },
  roleButtonTextActive: {
    color: '#000000',
  },
});
