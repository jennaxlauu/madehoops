import { useState } from 'react';
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
import { Search, Save, Award, Plus } from 'lucide-react-native';
import { MetricsForm } from '@/components/MetricsForm';
import { MetricsViewer } from '@/components/MetricsViewer';

type Athlete = {
  id: string;
  first_name: string;
  last_name: string;
};

type TabType = 'search' | 'workout';

export default function TrainerScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState<Athlete[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showMetricsForm, setShowMetricsForm] = useState(false);

  const [workoutSummary, setWorkoutSummary] = useState('');
  const [workoutAchievements, setWorkoutAchievements] = useState('');

  async function handleSearch() {
    if (!searchName.trim()) {
      setError('Please enter a name to search');
      return;
    }

    setError('');
    setSuccessMessage('');
    setSearching(true);

    try {
      const { data, error: searchError } = await supabase
        .from('athletes')
        .select('id, first_name, last_name')
        .or(`first_name.ilike.%${searchName.trim()}%,last_name.ilike.%${searchName.trim()}%`)
        .order('last_name');

      if (searchError) throw searchError;

      setSearchResults(data || []);
      if (!data || data.length === 0) {
        setError('No athletes found');
      }
    } catch (err) {
      setError('Failed to search athletes');
      console.error(err);
    } finally {
      setSearching(false);
    }
  }

  function selectAthlete(athlete: Athlete) {
    setSelectedAthlete(athlete);
    setSearchResults([]);
    setSearchName('');
    setError('');
  }

  async function handleSaveMetric() {
    if (!selectedAthlete) {
      setError('Please select an athlete first');
      return;
    }

    if (!metricType.trim()) {
      setError('Please enter a metric type');
      return;
    }

    if (!metricValue.trim()) {
      setError('Please enter a metric value');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const { error: insertError } = await supabase.from('athlete_metrics').insert({
        athlete_id: selectedAthlete.id,
        recorded_by: user?.id,
        metric_type: metricType.trim(),
        metric_value: metricValue.trim(),
        notes: metricNotes.trim() || null,
      });

      if (insertError) throw insertError;

      setSuccessMessage('Metric saved successfully!');
      setMetricType('');
      setMetricValue('');
      setMetricNotes('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save metric');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveWorkout() {
    if (!selectedAthlete) {
      setError('Please select an athlete first');
      return;
    }

    if (!workoutSummary.trim()) {
      setError('Please enter a workout summary');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const { error: insertError } = await supabase.from('workout_summaries').insert({
        athlete_id: selectedAthlete.id,
        trainer_id: user?.id,
        summary: workoutSummary.trim(),
        achievements: workoutAchievements.trim() || null,
      });

      if (insertError) throw insertError;

      setSuccessMessage('Workout summary saved successfully!');
      setWorkoutSummary('');
      setWorkoutAchievements('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save workout summary');
      console.error(err);
    } finally {
      setSaving(false);
    }
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
          <Text style={styles.welcomeText}>Trainer Portal</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

        <View style={styles.athleteSelection}>
          <Text style={styles.sectionTitle}>
            {selectedAthlete
              ? `Selected: ${selectedAthlete.first_name} ${selectedAthlete.last_name}`
              : 'Search for Athlete'}
          </Text>

          {!selectedAthlete && (
            <>
              <View style={styles.searchRow}>
                <TextInput
                  style={styles.searchInput}
                  value={searchName}
                  onChangeText={setSearchName}
                  placeholder="Enter athlete name"
                  placeholderTextColor="#666666"
                  autoCapitalize="words"
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleSearch}
                  disabled={searching}
                  activeOpacity={0.8}
                >
                  {searching ? (
                    <ActivityIndicator color="#000000" size="small" />
                  ) : (
                    <Search color="#000000" size={20} />
                  )}
                </TouchableOpacity>
              </View>

              {searchResults.length > 0 && (
                <View style={styles.searchResults}>
                  {searchResults.map((athlete) => (
                    <TouchableOpacity
                      key={athlete.id}
                      style={styles.athleteOption}
                      onPress={() => selectAthlete(athlete)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.athleteOptionText}>
                        {athlete.first_name} {athlete.last_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}

          {selectedAthlete && (
            <TouchableOpacity
              style={styles.changeAthleteButton}
              onPress={() => {
                setSelectedAthlete(null);
                setActiveTab('search');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.changeAthleteText}>Change Athlete</Text>
            </TouchableOpacity>
          )}
        </View>

        {selectedAthlete && (
          <>
            <TouchableOpacity
              style={styles.addMetricsButton}
              onPress={() => setShowMetricsForm(true)}
              activeOpacity={0.8}
            >
              <Plus color="#000000" size={20} />
              <Text style={styles.addMetricsButtonText}>Add Training Metrics</Text>
            </TouchableOpacity>

            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'search' && styles.tabActive]}
                onPress={() => setActiveTab('search')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'search' && styles.tabTextActive]}>
                  View Metrics
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'workout' && styles.tabActive]}
                onPress={() => setActiveTab('workout')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === 'workout' && styles.tabTextActive]}>
                  Workout Summary
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'search' && selectedAthlete && (
              <MetricsViewer
                athleteId={selectedAthlete.id}
                athleteName={`${selectedAthlete.first_name} ${selectedAthlete.last_name}`}
              />
            )}

            {activeTab === 'workout' && (
              <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Workout Summary</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={workoutSummary}
                    onChangeText={setWorkoutSummary}
                    placeholder="Describe the workout session..."
                    placeholderTextColor="#666666"
                    multiline
                    numberOfLines={5}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Achievements & Highlights (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={workoutAchievements}
                    onChangeText={setWorkoutAchievements}
                    placeholder="Notable achievements, milestones, or progress..."
                    placeholderTextColor="#666666"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveWorkout}
                  disabled={saving}
                  activeOpacity={0.8}
                >
                  {saving ? (
                    <ActivityIndicator color="#000000" />
                  ) : (
                    <>
                      <Award color="#000000" size={20} />
                      <Text style={styles.saveButtonText}>Save Workout</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={showMetricsForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMetricsForm(false)}
      >
        <MetricsForm
          athleteId={selectedAthlete?.id || ''}
          athleteName={
            selectedAthlete
              ? `${selectedAthlete.first_name} ${selectedAthlete.last_name}`
              : ''
          }
          recordedBy={user?.id || ''}
          onSuccess={() => {
            setShowMetricsForm(false);
            setSuccessMessage('Training metrics saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
          }}
          onCancel={() => setShowMetricsForm(false)}
        />
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
  athleteSelection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
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
  searchButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
    minHeight: 56,
  },
  searchResults: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    marginTop: 12,
    overflow: 'hidden',
  },
  athleteOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  athleteOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    letterSpacing: -0.32,
  },
  changeAthleteButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  changeAthleteText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
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
  addMetricsButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  addMetricsButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: -0.32,
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 56,
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: -0.32,
  },
});
