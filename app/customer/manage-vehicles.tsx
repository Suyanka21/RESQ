import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Car, Plus, Trash2 } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';
import EmptyState from '@/components/EmptyState';

const MOCK_VEHICLES = [
  { id: '1', make: 'Toyota', model: 'Corolla', year: '2020', plate: 'KDA 123A', color: 'White' },
  { id: '2', make: 'Subaru', model: 'Forester', year: '2018', plate: 'KCB 456B', color: 'Silver' },
];

export default function ManageVehiclesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Vehicles</Text>
        <TouchableOpacity
          style={styles.addButton}
          accessibilityLabel="Add vehicle"
          accessibilityRole="button"
        >
          <Plus size={20} color={colors.voltage} />
        </TouchableOpacity>
      </View>

      {MOCK_VEHICLES.length === 0 ? (
        <EmptyState
          title="No Vehicles"
          message="Add your vehicles to speed up service requests."
          icon={<Car size={48} color={colors.text.tertiary} />}
        />
      ) : (
        <FlatList
          data={MOCK_VEHICLES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MetalSurface variant="extruded" radius="lg" style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.carIcon}>
                  <Car size={24} color={colors.voltage} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.carName}>{item.make} {item.model}</Text>
                  <Text style={styles.carDetail}>{item.year} - {item.color}</Text>
                  <Text style={styles.carPlate}>{item.plate}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  accessibilityLabel={`Remove ${item.make} ${item.model}`}
                  accessibilityRole="button"
                >
                  <Trash2 size={18} color={colors.status.error} />
                </TouchableOpacity>
              </View>
            </MetalSurface>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    padding: spacing.lg,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  carIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,165,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  carName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  carDetail: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  carPlate: {
    color: colors.voltage,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.xs,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,61,61,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
