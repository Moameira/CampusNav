import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import Svg, { Polygon } from 'react-native-svg';
import { BUILDINGS, ROOM_TYPES } from '../data/campusData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_ASPECT_RATIO = 634 / 1400; // height / width of campus-map-color.png
const MAP_WIDTH = SCREEN_WIDTH - 32; // account for outer padding
const MAP_HEIGHT = MAP_WIDTH * MAP_ASPECT_RATIO;

// Building footprint polygons, traced from the colored Lageplan.
// Points are percentages (0-100) of the map image (campus-map-color.png, 1400x634).
const BUILDING_POLYGONS = {
  E: [[35.1,29.7],[40.2,29.7],[40.2,24.5],[44.9,24.5],[44.9,29.7],[53.9,29.7],[53.9,34.0],[56.4,34.0],[56.4,42.5],[49.2,42.5],[49.2,48.1],[37.2,48.1],[37.2,42.5],[35.1,42.5]],
  D: [[56.2,19.3],[61.6,19.3],[61.6,23.6],[64.1,23.6],[64.1,30.7],[57.3,30.7],[57.3,34.0],[53.9,34.0],[53.9,29.7],[56.2,29.7]],
  B: [[64.1,16.0],[70.1,16.0],[70.1,18.9],[71.4,18.9],[71.4,21.7],[74.0,21.7],[74.0,34.9],[71.8,34.9],[71.8,42.0],[64.1,42.0],[64.1,30.7],[61.6,30.7],[61.6,23.6],[64.1,23.6]],
  A: [[72.5,43.9],[77.8,43.9],[77.8,62.7],[74.4,62.7],[74.4,59.4],[74.0,59.4],[74.0,55.2],[72.5,55.2]],
  MENSA: [[68.0,53.8],[73.1,53.8],[73.1,62.3],[68.0,62.3]],
  N: [[22.0,40.1],[29.1,40.1],[29.1,42.5],[33.8,42.5],[33.8,55.7],[37.4,55.7],[37.4,65.1],[22.0,65.1]],
  S: [[26.7,74.1],[35.3,73.6],[35.1,87.3],[26.1,88.2]],
  L: [[37.0,74.1],[39.1,73.6],[39.1,95.8],[37.2,96.2],[37.0,87.3]],
  F: [[49.0,69.8],[51.3,69.6],[51.3,73.1],[49.0,73.4]],
};

function polygonToPoints(poly, width, height) {
  return poly.map(([x, y]) => `${(x / 100) * width},${(y / 100) * height}`).join(' ');
}

function polygonCentroid(poly) {
  const n = poly.length;
  const sum = poly.reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]);
  return [sum[0] / n, sum[1] / n];
}

function BuildingOverlay({ building, isSelected, onPress, mapWidth, mapHeight }) {
  const poly = BUILDING_POLYGONS[building.id];
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isSelected) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 0.4, duration: 500, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0.8, duration: 500, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulse.setValue(0.55);
    }
  }, [isSelected]);

  if (!poly) return null;

  const [cx, cy] = polygonCentroid(poly);

  return (
    <>
      <Svg
        width={mapWidth}
        height={mapHeight}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Polygon
          points={polygonToPoints(poly, mapWidth, mapHeight)}
          fill={building.color}
          fillOpacity={isSelected ? 0.45 : 0.001}
          stroke={building.color}
          strokeWidth={isSelected ? 2.5 : 0}
        />
      </Svg>
      {/* Tappable label + hit area at centroid */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.labelTouchable,
          {
            left: `${(cx / 100) * 100 - 6}%`,
            top: `${(cy / 100) * 100 - 6}%`,
          },
        ]}
      >
        <View style={[styles.labelBadge, { backgroundColor: building.color }]}>
          <Text style={styles.labelText}>{building.shortName}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
}

export default function MapScreen() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Hallo 👋</Text>
            <Text style={styles.title}>Campus Steinfurt</Text>
          </View>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🗺️</Text>
          </View>
        </View>

        <View style={styles.mapCard}>
          <Text style={styles.mapLabel}>TECHNOLOGIE-CAMPUS</Text>
          <Text style={styles.mapAddress}>Stegerwaldstraße 39</Text>

          <View style={[styles.mapImageContainer, { width: MAP_WIDTH, height: MAP_HEIGHT }]}>
            <Image
              source={require('../../assets/campus-map-color.png')}
              style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
              resizeMode="cover"
            />
            {BUILDINGS.map(building => (
              <BuildingOverlay
                key={building.id}
                building={building}
                isSelected={selectedBuilding?.id === building.id}
                onPress={() =>
                  setSelectedBuilding(
                    selectedBuilding?.id === building.id ? null : building
                  )
                }
                mapWidth={MAP_WIDTH}
                mapHeight={MAP_HEIGHT}
              />
            ))}
            <View style={styles.mapHintBadge}>
              <Text style={styles.mapHintText}>Tippe ein Gebäude</Text>
            </View>
          </View>
        </View>

        {/* Building chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          <TouchableOpacity
            style={[styles.chip, !selectedBuilding && styles.chipActive]}
            onPress={() => setSelectedBuilding(null)}
          >
            <Text style={[styles.chipText, !selectedBuilding && styles.chipTextActive]}>Alle</Text>
          </TouchableOpacity>
          {BUILDINGS.map(building => (
            <TouchableOpacity
              key={building.id}
              style={[
                styles.chip,
                selectedBuilding?.id === building.id && { backgroundColor: building.color, borderColor: building.color },
              ]}
              onPress={() =>
                setSelectedBuilding(
                  selectedBuilding?.id === building.id ? null : building
                )
              }
            >
              <Text
                style={[
                  styles.chipText,
                  selectedBuilding?.id === building.id && styles.chipTextActive,
                ]}
              >
                {building.shortName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Building detail or list */}
        {selectedBuilding ? (
          <View style={styles.detailSection}>
            <View style={styles.detailHeader}>
              <View style={[styles.detailBadge, { backgroundColor: selectedBuilding.color }]}>
                <Text style={styles.detailBadgeText}>{selectedBuilding.shortName}</Text>
              </View>
              <View style={styles.detailTitleContainer}>
                <Text style={styles.detailTitle}>{selectedBuilding.name}</Text>
                <Text style={styles.detailDesc}>{selectedBuilding.description}</Text>
              </View>
            </View>

            <Text style={styles.roomsTitle}>Räume ({selectedBuilding.rooms.length})</Text>
            {selectedBuilding.rooms.map(room => {
              const type = ROOM_TYPES[room.type];
              return (
                <View key={room.id} style={styles.roomItem}>
                  <Text style={styles.roomIcon}>{type.icon}</Text>
                  <View style={styles.roomInfo}>
                    <Text style={styles.roomName}>{room.name}</Text>
                    <Text style={styles.roomType}>{type.label}{room.description ? ` — ${room.description}` : ''}</Text>
                  </View>
                  {room.capacity && (
                    <Text style={styles.roomCapacity}>👥 {room.capacity}</Text>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.allBuildings}>
            <Text style={styles.allBuildingsTitle}>Alle Gebäude</Text>
            {BUILDINGS.map(building => (
              <TouchableOpacity
                key={building.id}
                style={styles.buildingRow}
                onPress={() => setSelectedBuilding(building)}
              >
                <View style={[styles.buildingDot, { backgroundColor: building.color }]}>
                  <Text style={styles.buildingDotText}>{building.shortName}</Text>
                </View>
                <View style={styles.buildingRowInfo}>
                  <Text style={styles.buildingRowName}>{building.name}</Text>
                  <Text style={styles.buildingRowDesc}>{building.description}</Text>
                </View>
                <Text style={styles.buildingArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
  },
  greeting: { fontSize: 12, color: '#5F5E5A' },
  title: { fontSize: 18, fontWeight: '700', color: '#042C53', marginTop: 2 },
  headerIcon: {
    width: 40, height: 40, borderRadius: 14, backgroundColor: '#185FA5',
    alignItems: 'center', justifyContent: 'center',
  },
  headerIconText: { fontSize: 18 },
  mapCard: {
    backgroundColor: '#185FA5', borderRadius: 20, padding: 12, marginHorizontal: 16,
  },
  mapLabel: { fontSize: 11, color: '#B5D4F4', fontWeight: '700', letterSpacing: 0.6, marginBottom: 2 },
  mapAddress: { fontSize: 16, color: '#fff', fontWeight: '600', marginBottom: 10 },
  mapImageContainer: {
    position: 'relative', borderRadius: 14, overflow: 'hidden', alignSelf: 'center',
  },
  mapHintBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(4,44,83,0.7)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  mapHintText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  labelTouchable: {
    position: 'absolute', width: '12%', alignItems: 'center', justifyContent: 'center',
  },
  labelBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  labelText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  chipRow: { paddingHorizontal: 16, marginTop: 14, marginBottom: 6 },
  chip: {
    backgroundColor: '#E6F1FB', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6,
    marginRight: 8, borderWidth: 1, borderColor: '#E6F1FB',
  },
  chipActive: { backgroundColor: '#185FA5', borderColor: '#185FA5' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#0C447C' },
  chipTextActive: { color: '#fff' },
  detailSection: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  detailBadge: {
    width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  detailBadgeText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  detailTitleContainer: { flex: 1 },
  detailTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  detailDesc: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  roomsTitle: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  roomItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12,
    padding: 12, marginBottom: 8,
  },
  roomIcon: { fontSize: 20, marginRight: 12 },
  roomInfo: { flex: 1 },
  roomName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  roomType: { fontSize: 12, color: '#6B7280', marginTop: 1 },
  roomCapacity: { fontSize: 12, color: '#9CA3AF' },
  allBuildings: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  allBuildingsTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 12 },
  buildingRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14,
    padding: 12, marginBottom: 8,
  },
  buildingDot: {
    width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  buildingDotText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  buildingRowInfo: { flex: 1 },
  buildingRowName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  buildingRowDesc: { fontSize: 12, color: '#6B7280', marginTop: 1 },
  buildingArrow: { fontSize: 20, color: '#9CA3AF' },
});