import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useState } from 'react';
import { BUILDINGS, ROOM_TYPES, QUICK_LINKS } from '../data/campusData';

const ALL_ROOMS = BUILDINGS.flatMap(building =>
  building.rooms.map(room => ({ ...room, buildingId: building.id, buildingName: building.name, buildingColor: building.color }))
);

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const filtered = ALL_ROOMS.filter(room => {
    const matchesQuery = query === '' ||
      room.name.toLowerCase().includes(query.toLowerCase()) ||
      (room.description && room.description.toLowerCase().includes(query.toLowerCase())) ||
      room.buildingName.toLowerCase().includes(query.toLowerCase());
    const matchesType = selectedType === null || room.type === selectedType;
    return matchesQuery && matchesType;
  });

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Raum suchen... z.B. D 250, Hörsaal, Labor"
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick links */}
      {query === '' && !selectedType && (
        <View style={styles.quickLinks}>
          <Text style={styles.sectionTitle}>⚡ Schnellzugriff</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {QUICK_LINKS.map(link => (
              <TouchableOpacity
                key={link.id}
                style={styles.quickCard}
                onPress={() => {
                  const room = ALL_ROOMS.find(r => r.id === link.room);
                  if (room) setSelectedRoom(room);
                }}
              >
                <Text style={styles.quickIcon}>{link.icon}</Text>
                <Text style={styles.quickLabel}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Type filters */}
      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterChip, selectedType === null && styles.filterChipActive]}
            onPress={() => setSelectedType(null)}
          >
            <Text style={[styles.filterText, selectedType === null && styles.filterTextActive]}>Alle</Text>
          </TouchableOpacity>
          {Object.entries(ROOM_TYPES).map(([key, type]) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterChip, selectedType === key && styles.filterChipActive]}
              onPress={() => setSelectedType(selectedType === key ? null : key)}
            >
              <Text style={styles.filterEmoji}>{type.icon}</Text>
              <Text style={[styles.filterText, selectedType === key && styles.filterTextActive]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      {selectedRoom ? (
        <View style={styles.roomDetail}>
          <View style={styles.roomDetailHeader}>
            <Text style={styles.roomDetailIcon}>{ROOM_TYPES[selectedRoom.type].icon}</Text>
            <View style={styles.roomDetailInfo}>
              <Text style={styles.roomDetailName}>{selectedRoom.name}</Text>
              <Text style={styles.roomDetailBuilding}>{selectedRoom.buildingName}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedRoom(null)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.roomDetailBody}>
            {[
              { label: 'Typ', value: ROOM_TYPES[selectedRoom.type].label },
              { label: 'Gebäude', value: selectedRoom.buildingName },
              { label: 'Etage', value: selectedRoom.floor === 0 ? 'Erdgeschoss' : `${selectedRoom.floor}. Etage` },
              ...(selectedRoom.capacity ? [{ label: 'Kapazität', value: `${selectedRoom.capacity} Personen` }] : []),
              ...(selectedRoom.description ? [{ label: 'Beschreibung', value: selectedRoom.description }] : []),
            ].map(item => (
              <View key={item.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.buildingTag, { backgroundColor: selectedRoom.buildingColor }]}>
            <Text style={styles.buildingTagText}>Gebäude {selectedRoom.buildingId}</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          style={styles.resultsList}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>Kein Raum gefunden</Text>
              <Text style={styles.emptySubtext}>Versuche einen anderen Suchbegriff</Text>
            </View>
          }
          renderItem={({ item }) => {
            const type = ROOM_TYPES[item.type];
            return (
              <TouchableOpacity style={styles.resultItem} onPress={() => setSelectedRoom(item)}>
                <View style={[styles.resultIcon, { backgroundColor: `${item.buildingColor}18` }]}>
                  <Text style={styles.resultEmoji}>{type.icon}</Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultMeta}>{item.buildingName} · {type.label}</Text>
                  {item.description && <Text style={styles.resultDesc}>{item.description}</Text>}
                </View>
                <View style={[styles.resultBadge, { backgroundColor: item.buildingColor }]}>
                  <Text style={styles.resultBadgeText}>{item.buildingId}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', margin: 16, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#111827' },
  clearBtn: { fontSize: 16, color: '#9CA3AF', padding: 4 },
  quickLinks: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 10 },
  quickCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    marginRight: 10, alignItems: 'center', minWidth: 90,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
  },
  quickIcon: { fontSize: 22, marginBottom: 4 },
  quickLabel: { fontSize: 11, color: '#374151', fontWeight: '500', textAlign: 'center' },
  filters: { paddingHorizontal: 16, marginBottom: 8 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12,
    paddingVertical: 6, marginRight: 8, borderWidth: 1, borderColor: '#E5E7EB',
  },
  filterChipActive: { backgroundColor: '#0F1623', borderColor: '#0F1623' },
  filterEmoji: { fontSize: 12, marginRight: 4 },
  filterText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  filterTextActive: { color: '#fff' },
  resultsList: { flex: 1, paddingHorizontal: 16 },
  resultItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, padding: 12, marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
  },
  resultIcon: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  resultEmoji: { fontSize: 20 },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  resultMeta: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  resultDesc: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  resultBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  resultBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  emptySubtext: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
  roomDetail: {
    backgroundColor: '#fff', margin: 16, borderRadius: 16,
    padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
  },
  roomDetailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  roomDetailIcon: { fontSize: 32, marginRight: 12 },
  roomDetailInfo: { flex: 1 },
  roomDetailName: { fontSize: 18, fontWeight: '700', color: '#111827' },
  roomDetailBuilding: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  closeBtn: { fontSize: 18, color: '#9CA3AF' },
  roomDetailBody: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  detailLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  detailValue: { fontSize: 13, color: '#111827', fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  buildingTag: { borderRadius: 8, padding: 10, alignItems: 'center' },
  buildingTagText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
