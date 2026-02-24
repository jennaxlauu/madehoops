import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export function ProfileButton() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();

  return (
    <TouchableOpacity
      style={styles.profileButton}
      onPress={() => router.push('/profile')}
      activeOpacity={0.8}
    >
      <Text style={styles.initialsText}>{initials}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#333333',
  },
  initialsText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: '#000000',
    letterSpacing: -0.32,
  },
});
