import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { UserPlus, Users, Plus, Trash2 } from 'lucide-react-native';
import { AthleteDetail } from '@/components/AthleteDetail';

type Athlete = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  age: number | null;
  gender: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_email: string | null;
  emergency_contact_phone: string | null;
  shirt_size: string | null;
  opted_in_to_marketing: boolean | null;
  organization: string | null;
  membership: string | null;
  tier: string | null;
};

type TabType = 'addAthlete' | 'viewAthletes';

export default function AdminScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('addAthlete');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loadingAthletes, setLoadingAthletes] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [showAthleteDetail, setShowAthleteDetail] = useState(false);

  useEffect(() => {
    if (activeTab === 'viewAthletes') {
      loadAthletes();
    }
  }, [activeTab]);

  async function loadAthletes() {
    setLoadingAthletes(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('athletes')
        .select('*')
        .order('last_name');

      if (fetchError) throw fetchError;
      setAthletes(data || []);
    } catch (err) {
      setError('Failed to load athletes');
      console.error(err);
    } finally {
      setLoadingAthletes(false);
    }
  }

  async function handleAddAthlete() {
    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }

    if (!lastName.trim()) {
      setError('Last name is required');
      return;
    }

    if (email.trim() && !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { error: insertError } = await supabase.from('athletes').insert({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
      });

      if (insertError) throw insertError;

      setSuccessMessage('Athlete added successfully!');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to add athlete');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAthlete(athleteId: string) {
    setDeletingId(athleteId);
    setError('');
    setSuccessMessage('');

    try {
      const { error: deleteError } = await supabase
        .from('athletes')
        .delete()
        .eq('id', athleteId);

      if (deleteError) throw deleteError;

      setSuccessMessage('Athlete deleted successfully');
      setAthletes(athletes.filter((a) => a.id !== athleteId));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete athlete');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  function handleAthleteClick(athlete: Athlete) {
    setSelectedAthlete(athlete);
    setShowAthleteDetail(true);
  }

  function handleCloseAthleteDetail() {
    setShowAthleteDetail(false);
    setSelectedAthlete(null);
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/MADE_Hoops_x_HMBL_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Admin Hub</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'addAthlete' && styles.tabActive]}
            onPress={() => setActiveTab('addAthlete')}
            activeOpacity={0.8}
          >
            <UserPlus
              color={activeTab === 'addAthlete' ? '#000000' : '#999999'}
              size={20}
            />
            <Text style={[styles.tabText, activeTab === 'addAthlete' && styles.tabTextActive]}>
              Add Athlete
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'viewAthletes' && styles.tabActive]}
            onPress={() => setActiveTab('viewAthletes')}
            activeOpacity={0.8}
          >
            <Users
              color={activeTab === 'viewAthletes' ? '#000000' : '#999999'}
              size={20}
            />
            <Text style={[styles.tabText, activeTab === 'viewAthletes' && styles.tabTextActive]}>
              View Athletes
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'addAthlete' && (
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor="#666666"
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor="#666666"
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email (Optional)</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor="#666666"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone (Optional)</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor="#666666"
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddAthlete}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <>
                  <Plus color="#000000" size={20} />
                  <Text style={styles.addButtonText}>Add Athlete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'viewAthletes' && (
          <View style={styles.athletesSection}>
            {loadingAthletes ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="large" />
              </View>
            ) : athletes.length === 0 ? (
              <Text style={styles.emptyText}>No athletes found</Text>
            ) : (
              <View style={styles.athletesList}>
                {athletes.map((athlete) => (
                  <View key={athlete.id} style={styles.athleteCard}>
                    <TouchableOpacity
                      style={styles.athleteInfo}
                      onPress={() => handleAthleteClick(athlete)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.athleteName}>
                        {athlete.first_name} {athlete.last_name}
                      </Text>
                      {athlete.email && (
                        <Text style={styles.athleteDetail}>{athlete.email}</Text>
                      )}
                      {athlete.phone && (
                        <Text style={styles.athleteDetail}>{athlete.phone}</Text>
                      )}
                      <Text style={styles.tapToView}>Tap to view details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteAthlete(athlete.id)}
                      disabled={deletingId === athlete.id}
                      activeOpacity={0.8}
                    >
                      {deletingId === athlete.id ? (
                        <ActivityIndicator color="#FF3B30" size="small" />
                      ) : (
                        <Trash2 color="#FF3B30" size={20} />
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showAthleteDetail}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseAthleteDetail}
      >
        {selectedAthlete && (
          <AthleteDetail athlete={selectedAthlete} onClose={handleCloseAthleteDetail} />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  logo: {
    width: 80,
    height: 80,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: -0.48,
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
  tabBar: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#999999',
    letterSpacing: -0.28,
  },
  tabTextActive: {
    color: '#000000',
  },
  formSection: {
    gap: 20,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    letterSpacing: -0.28,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    letterSpacing: -0.32,
    minHeight: 56,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 56,
  },
  addButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: -0.32,
  },
  athletesSection: {
    marginBottom: 32,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    letterSpacing: -0.32,
    textAlign: 'center',
    padding: 40,
  },
  athletesList: {
    gap: 12,
  },
  athleteCard: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  athleteInfo: {
    flex: 1,
    gap: 4,
  },
  athleteName: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: -0.36,
  },
  athleteDetail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    letterSpacing: -0.28,
  },
  tapToView: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#34C759',
    letterSpacing: -0.24,
    marginTop: 4,
  },
  deleteButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#FF3B30',
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
