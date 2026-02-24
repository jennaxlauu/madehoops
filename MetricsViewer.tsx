import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { MetricLineGraph } from './MetricLineGraph';

type MetricsViewerProps = {
  athleteId: string;
  athleteName: string;
};

type MetricRecord = {
  id: string;
  recorded_at: string;
  [key: string]: any;
};

export function MetricsViewer({ athleteId, athleteName }: MetricsViewerProps) {
  const [loading, setLoading] = useState(true);
  const [physicalMetrics, setPhysicalMetrics] = useState<MetricRecord[]>([]);
  const [testMetrics, setTestMetrics] = useState<MetricRecord[]>([]);
  const [drillMetrics, setDrillMetrics] = useState<MetricRecord[]>([]);
  const [strengthMetrics, setStrengthMetrics] = useState<MetricRecord[]>([]);

  useEffect(() => {
    fetchAllMetrics();
  }, [athleteId]);

  async function fetchAllMetrics() {
    setLoading(true);
    try {
      const [physical, tests, drills, strength] = await Promise.all([
        supabase
          .from('physical_measurements')
          .select('*')
          .eq('athlete_id', athleteId)
          .order('recorded_at', { ascending: false })
          .limit(5),
        supabase
          .from('physical_tests')
          .select('*')
          .eq('athlete_id', athleteId)
          .order('recorded_at', { ascending: false })
          .limit(5),
        supabase
          .from('basketball_drills')
          .select('*')
          .eq('athlete_id', athleteId)
          .order('recorded_at', { ascending: false })
          .limit(5),
        supabase
          .from('strength_conditioning')
          .select('*')
          .eq('athlete_id', athleteId)
          .order('recorded_at', { ascending: false })
          .limit(5),
      ]);

      setPhysicalMetrics(physical.data || []);
      setTestMetrics(tests.data || []);
      setDrillMetrics(drills.data || []);
      setStrengthMetrics(strength.data || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function renderMetricValue(value: any) {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') return value.toFixed(2);
    return value.toString();
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#FFFFFF" size="large" />
        <Text style={styles.loadingText}>Loading metrics...</Text>
      </View>
    );
  }

  const hasAnyMetrics =
    physicalMetrics.length > 0 ||
    testMetrics.length > 0 ||
    drillMetrics.length > 0 ||
    strengthMetrics.length > 0;

  if (!hasAnyMetrics) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No training metrics recorded yet for {athleteName}.
        </Text>
        <Text style={styles.emptySubtext}>
          Use the "Add Training Metrics" button to start tracking progress.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {physicalMetrics.length >= 2 && (
        <View style={styles.graphsSection}>
          <Text style={styles.sectionTitle}>Progress Graphs</Text>

          {physicalMetrics.filter((m) => m.height_inches).length >= 2 && (
            <MetricLineGraph
              data={physicalMetrics
                .filter((m) => m.height_inches)
                .reverse()
                .map((m) => ({
                  date: m.recorded_at,
                  value: parseFloat(m.height_inches),
                }))}
              title="Height Progress"
              unit='"'
            />
          )}

          {physicalMetrics.filter((m) => m.standing_vertical_inches).length >= 2 && (
            <MetricLineGraph
              data={physicalMetrics
                .filter((m) => m.standing_vertical_inches)
                .reverse()
                .map((m) => ({
                  date: m.recorded_at,
                  value: parseFloat(m.standing_vertical_inches),
                }))}
              title="Standing Vertical Progress"
              unit='"'
            />
          )}

          {physicalMetrics.filter((m) => m.approach_vertical_inches).length >= 2 && (
            <MetricLineGraph
              data={physicalMetrics
                .filter((m) => m.approach_vertical_inches)
                .reverse()
                .map((m) => ({
                  date: m.recorded_at,
                  value: parseFloat(m.approach_vertical_inches),
                }))}
              title="Approach Vertical Progress"
              unit='"'
            />
          )}

          {physicalMetrics.filter((m) => m.weight_lbs).length >= 2 && (
            <MetricLineGraph
              data={physicalMetrics
                .filter((m) => m.weight_lbs)
                .reverse()
                .map((m) => ({
                  date: m.recorded_at,
                  value: parseFloat(m.weight_lbs),
                }))}
              title="Weight Progress"
              unit=" lbs"
            />
          )}
        </View>
      )}

      {testMetrics.length >= 2 && (
        <View style={styles.graphsSection}>
          {testMetrics.filter((m) => m.sprint_40_yard_seconds).length >= 2 && (
            <MetricLineGraph
              data={testMetrics
                .filter((m) => m.sprint_40_yard_seconds)
                .reverse()
                .map((m) => ({
                  date: m.recorded_at,
                  value: parseFloat(m.sprint_40_yard_seconds),
                }))}
              title="40 Yard Sprint Progress"
              unit="s"
            />
          )}

          {testMetrics.filter((m) => m.lane_agility_seconds).length >= 2 && (
            <MetricLineGraph
              data={testMetrics
                .filter((m) => m.lane_agility_seconds)
                .reverse()
                .map((m) => ({
                  date: m.recorded_at,
                  value: parseFloat(m.lane_agility_seconds),
                }))}
              title="Lane Agility Progress"
              unit="s"
            />
          )}
        </View>
      )}

      {drillMetrics.length >= 2 && (
        <View style={styles.graphsSection}>
          {drillMetrics.filter((m) => m.free_throw_percentage).length >= 2 && (
            <MetricLineGraph
              data={drillMetrics
                .filter((m) => m.free_throw_percentage)
                .reverse()
                .map((m) => ({
                  date: m.recorded_at,
                  value: parseFloat(m.free_throw_percentage),
                }))}
              title="Free Throw % Progress"
              unit="%"
            />
          )}

          {drillMetrics.filter((m) => m.three_point_percentage).length >= 2 && (
            <MetricLineGraph
              data={drillMetrics
                .filter((m) => m.three_point_percentage)
                .reverse()
                .map((m) => ({
                  date: m.recorded_at,
                  value: parseFloat(m.three_point_percentage),
                }))}
              title="3-Point % Progress"
              unit="%"
            />
          )}
        </View>
      )}

      {strengthMetrics.length >= 2 && (
        <View style={styles.graphsSection}>
          {strengthMetrics.filter((m) => m.bench_press_lbs).length >= 2 && (
            <MetricLineGraph
              data={strengthMetrics
                .filter((m) => m.bench_press_lbs)
                .reverse()
                .map((m) => ({
                  date: m.recorded_at,
                  value: parseFloat(m.bench_press_lbs),
                }))}
              title="Bench Press Progress"
              unit=" lbs"
            />
          )}

          {strengthMetrics.filter((m) => m.squat_lbs).length >= 2 && (
            <MetricLineGraph
              data={strengthMetrics
                .filter((m) => m.squat_lbs)
                .reverse()
                .map((m) => ({
                  date: m.recorded_at,
                  value: parseFloat(m.squat_lbs),
                }))}
              title="Squat Progress"
              unit=" lbs"
            />
          )}

          {strengthMetrics.filter((m) => m.deadlift_lbs).length >= 2 && (
            <MetricLineGraph
              data={strengthMetrics
                .filter((m) => m.deadlift_lbs)
                .reverse()
                .map((m) => ({
                  date: m.recorded_at,
                  value: parseFloat(m.deadlift_lbs),
                }))}
              title="Deadlift Progress"
              unit=" lbs"
            />
          )}
        </View>
      )}

      {physicalMetrics.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Physical Measurements</Text>
          {physicalMetrics.map((metric) => (
            <View key={metric.id} style={styles.metricCard}>
              <Text style={styles.metricDate}>{formatDate(metric.recorded_at)}</Text>
              <View style={styles.metricGrid}>
                {metric.height_inches && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Height</Text>
                    <Text style={styles.metricValue}>
                      {renderMetricValue(metric.height_inches)}"
                    </Text>
                  </View>
                )}
                {metric.weight_lbs && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Weight</Text>
                    <Text style={styles.metricValue}>
                      {renderMetricValue(metric.weight_lbs)} lbs
                    </Text>
                  </View>
                )}
                {metric.standing_vertical_inches && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Standing Vert</Text>
                    <Text style={styles.metricValue}>
                      {renderMetricValue(metric.standing_vertical_inches)}"
                    </Text>
                  </View>
                )}
                {metric.approach_vertical_inches && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Approach Vert</Text>
                    <Text style={styles.metricValue}>
                      {renderMetricValue(metric.approach_vertical_inches)}"
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {testMetrics.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Tests</Text>
          {testMetrics.map((metric) => (
            <View key={metric.id} style={styles.metricCard}>
              <Text style={styles.metricDate}>{formatDate(metric.recorded_at)}</Text>
              <View style={styles.metricGrid}>
                {metric.sprint_40_yard_seconds && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>40 Yard</Text>
                    <Text style={styles.metricValue}>
                      {renderMetricValue(metric.sprint_40_yard_seconds)}s
                    </Text>
                  </View>
                )}
                {metric.lane_agility_seconds && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Lane Agility</Text>
                    <Text style={styles.metricValue}>
                      {renderMetricValue(metric.lane_agility_seconds)}s
                    </Text>
                  </View>
                )}
                {metric.shuttle_run_seconds && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Shuttle</Text>
                    <Text style={styles.metricValue}>
                      {renderMetricValue(metric.shuttle_run_seconds)}s
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {drillMetrics.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basketball Drills</Text>
          {drillMetrics.map((metric) => (
            <View key={metric.id} style={styles.metricCard}>
              <Text style={styles.metricDate}>{formatDate(metric.recorded_at)}</Text>
              <View style={styles.metricGrid}>
                {metric.free_throw_percentage && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>FT%</Text>
                    <Text style={styles.metricValue}>
                      {renderMetricValue(metric.free_throw_percentage)}%
                    </Text>
                  </View>
                )}
                {metric.three_point_percentage && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>3PT%</Text>
                    <Text style={styles.metricValue}>
                      {renderMetricValue(metric.three_point_percentage)}%
                    </Text>
                  </View>
                )}
                {metric.skill_evaluation && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Skill Eval</Text>
                    <Text style={styles.metricValue}>{metric.skill_evaluation}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {strengthMetrics.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Strength & Conditioning</Text>
          {strengthMetrics.map((metric) => (
            <View key={metric.id} style={styles.metricCard}>
              <Text style={styles.metricDate}>{formatDate(metric.recorded_at)}</Text>
              <View style={styles.metricGrid}>
                {metric.bench_press_lbs && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Bench</Text>
                    <Text style={styles.metricValue}>
                      {renderMetricValue(metric.bench_press_lbs)} lbs
                    </Text>
                  </View>
                )}
                {metric.squat_lbs && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Squat</Text>
                    <Text style={styles.metricValue}>
                      {renderMetricValue(metric.squat_lbs)} lbs
                    </Text>
                  </View>
                )}
                {metric.deadlift_lbs && (
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Deadlift</Text>
                    <Text style={styles.metricValue}>
                      {renderMetricValue(metric.deadlift_lbs)} lbs
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    letterSpacing: -0.32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    letterSpacing: -0.36,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    letterSpacing: -0.28,
    textAlign: 'center',
  },
  graphsSection: {
    gap: 16,
    marginBottom: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: -0.36,
    marginBottom: 8,
  },
  metricCard: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  metricDate: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#34C759',
    letterSpacing: -0.28,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricItem: {
    minWidth: '30%',
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    letterSpacing: -0.24,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    letterSpacing: -0.32,
  },
});
