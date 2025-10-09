import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockFolders, DesignFolder } from '../lib/mockData';
import SafeScreen from '../components/SafeScreen';

export default function CatalogScreen() {
  const insets = useSafeAreaInsets();

  const renderFolder = ({ item }: { item: DesignFolder }) => (
    <TouchableOpacity style={styles.folderCard}>
      <View style={styles.folderIcon}>
        <Text style={styles.folderIconText}>📁</Text>
      </View>
      <View style={styles.folderInfo}>
        <Text style={styles.folderName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.folderDescription}>{item.description}</Text>
        )}
        <Text style={styles.folderCount}>
          {item.designCount} {item.designCount === 1 ? 'diseño' : 'diseños'}
        </Text>
      </View>
      <View style={styles.folderArrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Carpeta</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{mockFolders.length}</Text>
          <Text style={styles.statLabel}>Carpetas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {mockFolders.reduce((sum, f) => sum + f.designCount, 0)}
          </Text>
          <Text style={styles.statLabel}>Diseños totales</Text>
        </View>
      </View>

      <FlatList
        data={mockFolders}
        renderItem={renderFolder}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🎨</Text>
            <Text style={styles.emptyStateText}>No hay carpetas aún</Text>
            <Text style={styles.emptyStateSubtext}>
              Creá tu primera carpeta para organizar tus diseños
            </Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={[
          styles.fab,
          { bottom: 80 + insets.bottom } // 🔥 Se adapta al área segura
        ]}
      >
        <Text style={styles.fabText}>+ Diseño</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  folderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  folderIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  folderIconText: {
    fontSize: 28,
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  folderDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  folderCount: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  folderArrow: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: '#ccc',
  },
  emptyState: {
    padding: 48,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});