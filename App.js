import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import MapScreen from './app/screens/MapScreen';
import SearchScreen from './app/screens/SearchScreen';
import AIScreen from './app/screens/AIScreen';
import InfoScreen from './app/screens/InfoScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#0F1623',
            borderTopColor: 'rgba(255,255,255,0.07)',
            paddingBottom: 8,
            paddingTop: 8,
            height: 65,
          },
          tabBarActiveTintColor: '#10B981',
          tabBarInactiveTintColor: '#6B7280',
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          headerStyle: { backgroundColor: '#0F1623' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Tab.Screen
          name="Map"
          component={MapScreen}
          options={{
            title: 'Campus Map',
            tabBarLabel: 'Map',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🗺️</Text>,
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: 'Find a Room',
            tabBarLabel: 'Rooms',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🔍</Text>,
          }}
        />
        <Tab.Screen
          name="AI"
          component={AIScreen}
          options={{
            title: 'AI Assistant',
            tabBarLabel: 'AI Chat',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🤖</Text>,
          }}
        />
        <Tab.Screen
          name="Info"
          component={InfoScreen}
          options={{
            title: 'Campus Info',
            tabBarLabel: 'Info',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>ℹ️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}