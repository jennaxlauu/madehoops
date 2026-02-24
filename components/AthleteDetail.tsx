import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

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

type AthleteDetailProps = {
  athlete: Athlete;
  onClose: () => void;
};

export function AthleteDetail({ athlete, onClose }: AthleteDetailProps) {
  function formatDate(dateString: string | null) {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function renderField(label: string, value: any) {
    return (
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>
          {value !== null && value !== undefined && value !== ''
            ? typeof value === 'boolean'
              ? value
                ? 'Yes'
                : 'No'
              : value.toString()
            : 'Not provided'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose} activeOpacity={0.7}>
          <ChevronLeft color="#FFFFFF" size={24} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Athlete Profile</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.nameSection}>
          <Text style={styles.athleteName}>
            {athlete.first_name} {athlete.last_name}
          </Text>
          {athlete.tier && (
            <View style={styles.tierBadge}>
              <Text style={styles.tierText}>{athlete.tier}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.fieldGroup}>
            {renderField('Email', athlete.email)}
            {renderField('Phone', athlete.phone)}
            {renderField('Date of Birth', formatDate(athlete.date_of_birth))}
            {renderField('Age', athlete.age)}
            {renderField('Gender', athlete.gender)}
            {renderField('Address', athlete.address)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <View style={styles.fieldGroup}>
            {renderField('Name', athlete.emergency_contact_name)}
            {renderField('Email', athlete.emergency_contact_email)}
            {renderField('Phone', athlete.emergency_contact_phone)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.fieldGroup}>
            {renderField('Shirt Size', athlete.shirt_size)}
            {renderField('Marketing Opt-In', athlete.opted_in_to_marketing)}
            {renderField('Organization', athlete.organization)}
            {renderField('Membership', athlete.membership)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    letterSpacing: -0.32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: -0.56,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  athleteName: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: -0.48,
    flex: 1,
  },
  tierBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    letterSpacing: -0.24,
    textTransform: 'uppercase',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
    letterSpacing: -0.36,
  },
  fieldGroup: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  field: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#999999',
    letterSpacing: -0.24,
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    letterSpacing: -0.32,
  },
});
