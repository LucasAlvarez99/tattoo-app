import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 30 }}>Bienvenido a Tattoo Manager</Text>
      <TouchableOpacity
        style={{ backgroundColor: '#111', padding: 15, borderRadius: 8 }}
        onPress={() => navigation.navigate('Calendar')}
      >
        <Text style={{ color: '#fff' }}>Ver Calendario</Text>
      </TouchableOpacity>
    </View>
  );
}
