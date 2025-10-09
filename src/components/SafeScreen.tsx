import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  backgroundColor?: string;
}

/**
 * Componente que adapta el contenido a las áreas seguras del dispositivo
 * (notch, barra de estado, navegación inferior, etc.)
 */
export default function SafeScreen({ 
  children, 
  style, 
  edges = ['top', 'bottom', 'left', 'right'],
  backgroundColor = '#fff'
}: SafeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View 
      style={[
        styles.container,
        { backgroundColor },
        {
          paddingTop: edges.includes('top') ? insets.top : 0,
          paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
          paddingLeft: edges.includes('left') ? insets.left : 0,
          paddingRight: edges.includes('right') ? insets.right : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});