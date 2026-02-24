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
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Search, CheckCircle } from 'lucide-react-native';

type Athlete = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  tier: string | null;
};

type CheckInStats = {
  total: number;
  weekly: number;
  monthly: number;
  tier: string;
  checkInDates: string[];
};

export default function CheckInScreen() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [searchResults, setSearchResults] = useState<Athlete[]>([]);
  const [searching, setSearching] = useState(false);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [checkedInAthlete, setCheckedInAthlete] = useState<Athlete | null>(null);
  const [checkInStats, setCheckInStats] = useState<CheckInStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  async function handleSearch() {
    if (!firstName.trim() && !lastName.trim()) {
      setError('Please enter at least a first name or last name');
      return;
    }

    setError('');
    setSuccessMessage('');
    setSearching(true);

    try {
      let query = supabase.from('athletes').select('*');

      if (firstName.trim()) {
        query = query.ilike('first_name', `%${firstName.trim()}%`);
      }
      if (lastName.trim()) {
        query = query.ilike('last_name', `%${lastName.trim()}%`);
      }

      const { data, error: searchError } = await query.order('last_name');

      if (searchError) throw searchError;

      setSearchResults(data || []);
      if (!data || data.length === 0) {
        setError('No athletes found matching your search');
      }
    } catch (err) {
      setError('Failed to search athletes');
      console.error(err);
    } finally {
      setSearching(false);
    }
  }

  async function handleCheckIn(athlete: Athlete) {
    setCheckingIn(athlete.id);
    setError('');
    setSuccessMessage('');
    setCheckedInAthlete(null);
    setCheckInStats(null);

    try {
      const { error: checkInError } = await supabase.from('check_ins').insert({
        athlete_id: athlete.id,
        checked_in_by: user?.id,
        check_in_time: new Date().toISOString(),
      });

      if (checkInError) throw checkInError;

      setSuccessMessage(`${athlete.first_name} ${athlete.last_name} checked in successfully!`);
      setCheckedInAthlete(athlete);

      await fetchCheckInStats(athlete.id, athlete.tier || 'standard');
    } catch (err) {
      setError('Failed to check in athlete');
      console.error(err);
    } finally {
      setCheckingIn(null);
    }
  }

  async function fetchCheckInStats(athleteId: string, tier: string) {
    setLoadingStats(true);
    try {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const { data: allCheckIns, error: allError } = await supabase
        .from('check_ins')
        .select('check_in_time')
        .eq('athlete_id', athleteId)
        .order('check_in_time', { ascending: false });

      if (allError) throw allError;

      const weeklyCheckIns = allCheckIns?.filter(
        (c) => new Date(c.check_in_time) >= oneWeekAgo
      ).length || 0;

      const monthlyCheckIns = allCheckIns?.filter(
        (c) => new Date(c.check_in_time) >= oneMonthAgo
      ).length || 0;

      const checkInDates = allCheckIns?.map((c) => c.check_in_time) || [];

      setCheckInStats({
        total: allCheckIns?.length || 0,
        weekly: weeklyCheckIns,
        monthly: monthlyCheckIns,
        tier: tier,
        checkInDates: checkInDates,
      });
    } catch (err) {
      console.error('Failed to fetch check-in stats:', err);
    } finally {
      setLoadingStats(false);
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
          <Text style={styles.welcomeText}>Check-In Desk</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Search Athletes</Text>

          <View style={styles.searchForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor="#666666"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor="#666666"
                autoCapitalize="words"
              />
            </View>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={searching}
              activeOpacity={0.8}
            >
              {searching ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <>
                  <Search color="#000000" size={20} />
                  <Text style={styles.searchButtonText}>Search</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {searchResults.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            <View style={styles.resultsList}>
              {searchResults.map((athlete) => (
                <View key={athlete.id} style={styles.athleteCard}>
                  <View style={styles.athleteInfo}>
                    <Text style={styles.athleteName}>
                      {athlete.first_name} {athlete.last_name}
                    </Text>
                    {athlete.email && (
                      <Text style={styles.athleteDetail}>{athlete.email}</Text>
                    )}
                    {athlete.phone && (
                      <Text style={styles.athleteDetail}>{athlete.phone}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.checkInButton}
                    onPress={() => handleCheckIn(athlete)}
                    disabled={checkingIn === athlete.id}
                    activeOpacity={0.8}
                  >
                    {checkingIn === athlete.id ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <CheckCircle color="#FFFFFF" size={20} />
                        <Text style={styles.checkInButtonText}>Check In</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {checkedInAthlete && checkInStats && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>
              Check-In Stats for {checkedInAthlete.first_name} {checkedInAthlete.last_name}
            </Text>

            {loadingStats ? (
              <ActivityIndicator color="#FFFFFF" size="large" />
            ) : (
              <>
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{checkInStats.total}</Text>
                    <Text style={styles.statLabel}>Total Check-Ins</Text>
                  </View>

                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{checkInStats.weekly}</Text>
                    <Text style={styles.statLabel}>This Week</Text>
                  </View>

                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{checkInStats.monthly}</Text>
                    <Text style={styles.statLabel}>This Month</Text>
                  </View>

                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{checkInStats.tier}</Text>
                    <Text style={styles.statLabel}>Tier</Text>
                  </View>
                </View>

                <View style={styles.heatmapSection}>
                  <Text style={styles.heatmapTitle}>Check-In Frequency (Last 30 Days)</Text>
                  <View style={styles.heatmap}>
                    {Array.from({ length: 30 }).map((_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (29 - i));
                      const dateStr = date.toISOString().split('T')[0];
                      const count = checkInStats.checkInDates.filter((d) =>
                        d.startsWith(dateStr)
                      ).length;

                      const intensity = count === 0 ? 0 : Math.min(count / 3, 1);

                      return (
                        <View
                          key={i}
                          style={[
                            styles.heatmapCell,
                            {
                              backgroundColor:
                                intensity === 0
                                  ? '#1A1A1A'
                                  : `rgba(52, 199, 89, ${0.3 + intensity * 0.7})`,
                            },
                          ]}
                        />
                      );
                    })}
                  </View>
                  <View style={styles.heatmapLegend}>
                    <Text style={styles.legendText}>Less</Text>
                    <View style={styles.legendGradient}>
                      <View style={[styles.legendCell, { backgroundColor: '#1A1A1A' }]} />
                      <View style={[styles.legendCell, { backgroundColor: 'rgba(52, 199, 89, 0.3)' }]} />
                      <View style={[styles.legendCell, { backgroundColor: 'rgba(52, 199, 89, 0.6)' }]} />
                      <View style={[styles.legendCell, { backgroundColor: 'rgba(52, 199, 89, 1)' }]} />
                    </View>
                    <Text style={styles.legendText}>More</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
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
  searchSection: {
    marginBottom: 32,
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
  searchForm: {
    gap: 16,
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
  searchButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 56,
  },
  searchButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: -0.32,
  },
  resultsSection: {
    marginBottom: 32,
  },
  resultsList: {
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
  checkInButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  checkInButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: -0.28,
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    fontStyle: 'italic',
    color: '#34C759',
    letterSpacing: -0.64,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    letterSpacing: -0.28,
    textAlign: 'center',
  },
  heatmapSection: {
    marginTop: 24,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
  },
  heatmapTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    letterSpacing: -0.32,
    marginBottom: 16,
  },
  heatmap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  heatmapCell: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    letterSpacing: -0.24,
  },
  legendGradient: {
    flexDirection: 'row',
    gap: 4,
  },
  legendCell: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
});
