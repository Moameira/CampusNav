import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useState } from 'react';
import { BUILDINGS, ROOM_TYPES } from '../data/campusData';

const INFO_SECTIONS = [
  {
    id: 'opening',
    title: '🕐 Öffnungszeiten',
    icon: '🕐',
    items: [
      { label: 'Bibliothek', value: 'Mo–Fr: 08:00–20:00\nSa: 09:00–14:00' },
      { label: 'Mensa', value: 'Mo–Fr: 11:30–14:00' },
      { label: 'Sekretariat', value: 'Mo–Fr: 09:00–12:00' },
      { label: 'AStA', value: 'Mo–Fr: 10:00–14:00' },
    ],
  },
  {
    id: 'contact',
    title: '📞 Kontakt',
    icon: '📞',
    items: [
      { label: 'FH Münster Steinfurt', value: '+49 2551 9-62000' },
      { label: 'Prüfungsamt Informatik', value: 'A 213 · Mi 10:00–12:00' },
      { label: 'IT-Support', value: 'support@fh-muenster.de' },
      { label: 'AStA', value: 'asta@fh-muenster.de' },
    ],
  },
  {
    id: 'transport',
    title: '🚌 Anfahrt',
    icon: '🚌',
    items: [
      { label: 'Bus', value: 'Linie 1, 2, R12\nHaltestelle: FH Steinfurt' },
      { label: 'Auto', value: 'Abfahrt Burgsteinfurt B54\nParkhaus am Campus' },
      { label: 'Fahrrad', value: 'Fahrradstellplätze\nbei allen Eingängen' },
      { label: 'Adresse', value: 'Stegerwaldstraße 39\n48565 Steinfurt' },
    ],
  },
  {
    id: 'links',
    title: '🔗 Wichtige Links',
    icon: '🔗',
    items: [
      { label: 'FH Münster Website', value: 'fh-muenster.de', url: 'https://www.fh-muenster.de' },
      { label: 'Stundenplan', value: 'stundenplan.fh-muenster.de', url: 'https://stundenplan.fh-muenster.de' },
      { label: 'Moodle', value: 'moodle.fh-muenster.de', url: 'https://moodle.fh-muenster.de' },
      { label: 'Bibliothek', value: 'bibliothek.fh-muenster.de', url: 'https://www.fh-muenster.de/bibliothek' },
    ],
  },
];

export default function InfoScreen() {
  const [expandedSection, setExpandedSection] = useState('opening');

  return (
    <ScrollView style={styles.container}>
      {/* Campus Header */}
      <View style={styles.campusHeader}>
        <View style={styles.campusLogo}>
          <Text style={styles.campusLogoText}>FH</Text>
        </View>
        <View>
          <Text style={styles.campusName}>FH Münster</Text>
          <Text style={styles.campusSub}>Technologie-Campus Steinfurt</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Gebäude', value: BUILDINGS.length.toString() },
          { label: 'Räume', value: BUILDINGS.reduce((sum, b) => sum + b.rooms.length, 0).toString() },
          { label: 'Studierende', value: '~4.700' },
          { label: 'Fachbereiche', value: '5' },
        ].map(stat => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Room type legend */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏛️ Raumtypen</Text>
        <View style={styles.legendGrid}>
          {Object.entries(ROOM_TYPES).map(([key, type]) => (
            <View key={key} style={styles.legendItem}>
              <Text style={styles.legendIcon}>{type.icon}</Text>
              <Text style={styles.legendLabel}>{type.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Info sections */}
      {INFO_SECTIONS.map(section => (
        <View key={section.id} style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setExpandedSection(
              expandedSection === section.id ? null : section.id
            )}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionChevron}>
              {expandedSection === section.id ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {expandedSection === section.id && (
            <View style={styles.sectionBody}>
              {section.items.map(item => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.infoRow}
                  onPress={() => item.url && Linking.openURL(item.url)}
                  disabled={!item.url}
                >
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={[
                    styles.infoValue,
                    item.url && styles.infoLink,
                  ]}>{item.value}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}

      {/* Buildings overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏢 Gebäudeübersicht</Text>
        {BUILDINGS.map(building => (
          <View key={building.id} style={styles.buildingRow}>
            <View style={[styles.buildingDot, { backgroundColor: building.color }]}>
              <Text style={styles.buildingDotText}>{building.shortName}</Text>
            </View>
            <View style={styles.buildingInfo}>
              <Text style={styles.buildingName}>{building.name}</Text>
              <Text style={styles.buildingDesc}>{building.description}</Text>
              <Text style={styles.buildingRooms}>{building.rooms.length} Räume · {building.floors} Etagen</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>CampusNav · FH Münster Steinfurt</Text>
        <Text style={styles.footerSub}>Made with ❤️ by a student for students</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  campusHeader: {
    backgroundColor: '#0F1623', flexDirection: 'row',
    alignItems: 'center', gap: 14, padding: 20,
  },
  campusLogo: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center',
  },
  campusLogoText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  campusName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  campusSub: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  statsRow: {
    flexDirection: 'row', gap: 10, padding: 16,
  },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12,
    padding: 12, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
  },
  statValue: { fontSize: 20, fontWeight: '700', color: '#111827' },
  statLabel: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  section: {
    backgroundColor: '#fff', marginHorizontal: 16,
    marginBottom: 12, borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  sectionChevron: { fontSize: 12, color: '#9CA3AF' },
  sectionBody: { paddingHorizontal: 16, paddingBottom: 12 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  infoLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500', flex: 1 },
  infoValue: { fontSize: 13, color: '#111827', textAlign: 'right', flex: 1 },
  infoLink: { color: '#10B981', textDecorationLine: 'underline' },
  legendGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 8, padding: 16, paddingTop: 0,
  },
  legendItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F9FAFB', borderRadius: 8, padding: 8, minWidth: '45%',
  },
  legendIcon: { fontSize: 16 },
  legendLabel: { fontSize: 12, color: '#374151', fontWeight: '500' },
  buildingRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    padding: 12, borderTopWidth: 1, borderTopColor: '#F9FAFB',
  },
  buildingDot: {
    width: 36, height: 36, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  buildingDotText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  buildingInfo: { flex: 1 },
  buildingName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  buildingDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  buildingRooms: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  footer: { alignItems: 'center', padding: 24 },
  footerText: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },
  footerSub: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
});
