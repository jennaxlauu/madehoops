import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { supabase } from '@/lib/supabase';

type MetricsFormProps = {
  athleteId: string;
  athleteName: string;
  recordedBy: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export function MetricsForm({
  athleteId,
  athleteName,
  recordedBy,
  onSuccess,
  onCancel,
}: MetricsFormProps) {
  const [activeTab, setActiveTab] = useState<
    'physical' | 'tests' | 'drills' | 'strength'
  >('physical');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [physicalData, setPhysicalData] = useState({
    height_inches: '',
    standing_vertical_inches: '',
    approach_vertical_inches: '',
    weight_lbs: '',
    wingspan_inches: '',
    standing_reach_inches: '',
    body_fat_percentage: '',
    notes: '',
  });

  const [testsData, setTestsData] = useState({
    sprint_40_yard_seconds: '',
    lane_agility_seconds: '',
    shuttle_run_seconds: '',
    mile_run_seconds: '',
    conditioning_score: '',
    notes: '',
  });

  const [drillsData, setDrillsData] = useState({
    free_throw_percentage: '',
    three_point_percentage: '',
    mid_range_percentage: '',
    ball_handling_score: '',
    defensive_drill_score: '',
    shooting_drill_score: '',
    skill_evaluation: '',
    scrimmage_grade: '',
    notes: '',
  });

  const [strengthData, setStrengthData] = useState({
    bench_press_lbs: '',
    squat_lbs: '',
    deadlift_lbs: '',
    pull_ups_count: '',
    push_ups_count: '',
    conditioning_circuit_time_seconds: '',
    conditioning_circuit_score: '',
    notes: '',
  });

  async function handleSave() {
    setSaving(true);
    setError('');

    try {
      const timestamp = new Date().toISOString();
      const commonData = {
        athlete_id: athleteId,
        recorded_by: recordedBy,
        recorded_at: timestamp,
      };

      const tableName =
        activeTab === 'physical'
          ? 'physical_measurements'
          : activeTab === 'tests'
          ? 'physical_tests'
          : activeTab === 'drills'
          ? 'basketball_drills'
          : 'strength_conditioning';

      const data =
        activeTab === 'physical'
          ? physicalData
          : activeTab === 'tests'
          ? testsData
          : activeTab === 'drills'
          ? drillsData
          : strengthData;

      const processedData: any = { ...commonData };
      Object.entries(data).forEach(([key, value]) => {
        if (value !== '') {
          processedData[key] = key.includes('notes') ? value : parseFloat(value) || value;
        }
      });

      const { error: saveError } = await supabase.from(tableName).insert(processedData);

      if (saveError) throw saveError;

      onSuccess();
    } catch (err) {
      setError('Failed to save metrics');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function renderPhysicalForm() {
    return (
      <View style={styles.formSection}>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (inches)</Text>
            <TextInput
              style={styles.input}
              value={physicalData.height_inches}
              onChangeText={(text) =>
                setPhysicalData({ ...physicalData, height_inches: text })
              }
              placeholder="72"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (lbs)</Text>
            <TextInput
              style={styles.input}
              value={physicalData.weight_lbs}
              onChangeText={(text) =>
                setPhysicalData({ ...physicalData, weight_lbs: text })
              }
              placeholder="180"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Standing Vert (in)</Text>
            <TextInput
              style={styles.input}
              value={physicalData.standing_vertical_inches}
              onChangeText={(text) =>
                setPhysicalData({ ...physicalData, standing_vertical_inches: text })
              }
              placeholder="28"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Approach Vert (in)</Text>
            <TextInput
              style={styles.input}
              value={physicalData.approach_vertical_inches}
              onChangeText={(text) =>
                setPhysicalData({ ...physicalData, approach_vertical_inches: text })
              }
              placeholder="32"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Wingspan (in)</Text>
            <TextInput
              style={styles.input}
              value={physicalData.wingspan_inches}
              onChangeText={(text) =>
                setPhysicalData({ ...physicalData, wingspan_inches: text })
              }
              placeholder="74"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Standing Reach (in)</Text>
            <TextInput
              style={styles.input}
              value={physicalData.standing_reach_inches}
              onChangeText={(text) =>
                setPhysicalData({ ...physicalData, standing_reach_inches: text })
              }
              placeholder="96"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Body Fat %</Text>
          <TextInput
            style={styles.input}
            value={physicalData.body_fat_percentage}
            onChangeText={(text) =>
              setPhysicalData({ ...physicalData, body_fat_percentage: text })
            }
            placeholder="12.5"
            placeholderTextColor="#666666"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={physicalData.notes}
            onChangeText={(text) => setPhysicalData({ ...physicalData, notes: text })}
            placeholder="Additional notes..."
            placeholderTextColor="#666666"
            multiline
            numberOfLines={3}
          />
        </View>
      </View>
    );
  }

  function renderTestsForm() {
    return (
      <View style={styles.formSection}>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>40 Yard Sprint (sec)</Text>
            <TextInput
              style={styles.input}
              value={testsData.sprint_40_yard_seconds}
              onChangeText={(text) =>
                setTestsData({ ...testsData, sprint_40_yard_seconds: text })
              }
              placeholder="5.2"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lane Agility (sec)</Text>
            <TextInput
              style={styles.input}
              value={testsData.lane_agility_seconds}
              onChangeText={(text) =>
                setTestsData({ ...testsData, lane_agility_seconds: text })
              }
              placeholder="11.5"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Shuttle Run (sec)</Text>
            <TextInput
              style={styles.input}
              value={testsData.shuttle_run_seconds}
              onChangeText={(text) =>
                setTestsData({ ...testsData, shuttle_run_seconds: text })
              }
              placeholder="4.5"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mile Run (sec)</Text>
            <TextInput
              style={styles.input}
              value={testsData.mile_run_seconds}
              onChangeText={(text) =>
                setTestsData({ ...testsData, mile_run_seconds: text })
              }
              placeholder="360"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Conditioning Score</Text>
          <TextInput
            style={styles.input}
            value={testsData.conditioning_score}
            onChangeText={(text) =>
              setTestsData({ ...testsData, conditioning_score: text })
            }
            placeholder="85"
            placeholderTextColor="#666666"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={testsData.notes}
            onChangeText={(text) => setTestsData({ ...testsData, notes: text })}
            placeholder="Additional notes..."
            placeholderTextColor="#666666"
            multiline
            numberOfLines={3}
          />
        </View>
      </View>
    );
  }

  function renderDrillsForm() {
    return (
      <View style={styles.formSection}>
        <Text style={styles.subheading}>Shooting Percentages</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Free Throw %</Text>
            <TextInput
              style={styles.input}
              value={drillsData.free_throw_percentage}
              onChangeText={(text) =>
                setDrillsData({ ...drillsData, free_throw_percentage: text })
              }
              placeholder="75"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>3-Point %</Text>
            <TextInput
              style={styles.input}
              value={drillsData.three_point_percentage}
              onChangeText={(text) =>
                setDrillsData({ ...drillsData, three_point_percentage: text })
              }
              placeholder="40"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mid-Range %</Text>
          <TextInput
            style={styles.input}
            value={drillsData.mid_range_percentage}
            onChangeText={(text) =>
              setDrillsData({ ...drillsData, mid_range_percentage: text })
            }
            placeholder="50"
            placeholderTextColor="#666666"
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.subheading}>Drill Scores</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ball Handling</Text>
            <TextInput
              style={styles.input}
              value={drillsData.ball_handling_score}
              onChangeText={(text) =>
                setDrillsData({ ...drillsData, ball_handling_score: text })
              }
              placeholder="85"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Defensive</Text>
            <TextInput
              style={styles.input}
              value={drillsData.defensive_drill_score}
              onChangeText={(text) =>
                setDrillsData({ ...drillsData, defensive_drill_score: text })
              }
              placeholder="90"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Shooting Drill</Text>
          <TextInput
            style={styles.input}
            value={drillsData.shooting_drill_score}
            onChangeText={(text) =>
              setDrillsData({ ...drillsData, shooting_drill_score: text })
            }
            placeholder="88"
            placeholderTextColor="#666666"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Skill Evaluation</Text>
            <TextInput
              style={styles.input}
              value={drillsData.skill_evaluation}
              onChangeText={(text) =>
                setDrillsData({ ...drillsData, skill_evaluation: text })
              }
              placeholder="A-"
              placeholderTextColor="#666666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Scrimmage Grade</Text>
            <TextInput
              style={styles.input}
              value={drillsData.scrimmage_grade}
              onChangeText={(text) =>
                setDrillsData({ ...drillsData, scrimmage_grade: text })
              }
              placeholder="B+"
              placeholderTextColor="#666666"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={drillsData.notes}
            onChangeText={(text) => setDrillsData({ ...drillsData, notes: text })}
            placeholder="Additional notes..."
            placeholderTextColor="#666666"
            multiline
            numberOfLines={3}
          />
        </View>
      </View>
    );
  }

  function renderStrengthForm() {
    return (
      <View style={styles.formSection}>
        <Text style={styles.subheading}>Main Lifts</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bench Press (lbs)</Text>
            <TextInput
              style={styles.input}
              value={strengthData.bench_press_lbs}
              onChangeText={(text) =>
                setStrengthData({ ...strengthData, bench_press_lbs: text })
              }
              placeholder="185"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Squat (lbs)</Text>
            <TextInput
              style={styles.input}
              value={strengthData.squat_lbs}
              onChangeText={(text) =>
                setStrengthData({ ...strengthData, squat_lbs: text })
              }
              placeholder="225"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deadlift (lbs)</Text>
          <TextInput
            style={styles.input}
            value={strengthData.deadlift_lbs}
            onChangeText={(text) =>
              setStrengthData({ ...strengthData, deadlift_lbs: text })
            }
            placeholder="275"
            placeholderTextColor="#666666"
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.subheading}>Bodyweight Exercises</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pull-Ups</Text>
            <TextInput
              style={styles.input}
              value={strengthData.pull_ups_count}
              onChangeText={(text) =>
                setStrengthData({ ...strengthData, pull_ups_count: text })
              }
              placeholder="15"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Push-Ups</Text>
            <TextInput
              style={styles.input}
              value={strengthData.push_ups_count}
              onChangeText={(text) =>
                setStrengthData({ ...strengthData, push_ups_count: text })
              }
              placeholder="50"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.subheading}>Conditioning</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Circuit Time (sec)</Text>
            <TextInput
              style={styles.input}
              value={strengthData.conditioning_circuit_time_seconds}
              onChangeText={(text) =>
                setStrengthData({
                  ...strengthData,
                  conditioning_circuit_time_seconds: text,
                })
              }
              placeholder="300"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Circuit Score</Text>
            <TextInput
              style={styles.input}
              value={strengthData.conditioning_circuit_score}
              onChangeText={(text) =>
                setStrengthData({ ...strengthData, conditioning_circuit_score: text })
              }
              placeholder="92"
              placeholderTextColor="#666666"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={strengthData.notes}
            onChangeText={(text) => setStrengthData({ ...strengthData, notes: text })}
            placeholder="Additional notes..."
            placeholderTextColor="#666666"
            multiline
            numberOfLines={3}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Training Metrics for {athleteName}</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'physical' && styles.activeTab]}
          onPress={() => setActiveTab('physical')}
        >
          <Text style={[styles.tabText, activeTab === 'physical' && styles.activeTabText]}>
            Physical
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'tests' && styles.activeTab]}
          onPress={() => setActiveTab('tests')}
        >
          <Text style={[styles.tabText, activeTab === 'tests' && styles.activeTabText]}>
            Tests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'drills' && styles.activeTab]}
          onPress={() => setActiveTab('drills')}
        >
          <Text style={[styles.tabText, activeTab === 'drills' && styles.activeTabText]}>
            Drills
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'strength' && styles.activeTab]}
          onPress={() => setActiveTab('strength')}
        >
          <Text style={[styles.tabText, activeTab === 'strength' && styles.activeTabText]}>
            Strength
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'physical' && renderPhysicalForm()}
        {activeTab === 'tests' && renderTestsForm()}
        {activeTab === 'drills' && renderDrillsForm()}
        {activeTab === 'strength' && renderStrengthForm()}
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text style={styles.saveButtonText}>Save Metrics</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#666666',
    letterSpacing: -0.28,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  errorText: {
    backgroundColor: '#FF3B30',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 24,
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    letterSpacing: -0.28,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  formSection: {
    gap: 16,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    letterSpacing: -0.32,
    marginTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
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
    minHeight: 96,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: -0.32,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: -0.32,
  },
});
