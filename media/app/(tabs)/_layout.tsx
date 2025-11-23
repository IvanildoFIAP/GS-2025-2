import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#005F99',
        tabBarInactiveTintColor: '#999',
        headerStyle: {
            backgroundColor: '#005F99',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Nova Triagem',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'Minhas Triagens',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'list' : 'list-outline'} size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="units"
        options={{
          title: 'Unidades',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'medkit' : 'medkit-outline'} size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profiles"
        options={{
          title: 'Perfil',
          headerTitle: 'Meu Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}