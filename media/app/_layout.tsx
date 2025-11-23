import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen
        name="result"
        options={{
          title: 'Resultado da Triagem',
          headerStyle: { backgroundColor: '#005F99' },
          headerTintColor: '#fff',
        }}
      />
    </Stack>
  );
}