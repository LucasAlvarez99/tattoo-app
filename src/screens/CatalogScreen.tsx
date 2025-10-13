import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockFolders, mockDesigns, DesignFolder } from '../lib/mockData';
import SafeScreen from '../components/SafeScreen';

type CatalogScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'CatalogTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: CatalogScreenNavigationProp;
};

export default function CatalogScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [folders, setFolders] = useState<DesignFolder[]>(mockFolders);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#fef3c7');

  const colors = [
    '#fef3c7', // Amarillo
    '#dbeafe', // Azul
    '#fecaca', // Rojo
    '#d1fae5', // Verde
    '#e9d5ff', // Púrpura
    '#fed7aa', // Naranja
    '#fbcfe8', // Rosa
    '#d1d5db', // Gris
  ];

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      Alert.alert('Error', 'El nombre de la carpeta es requerido');
      return;
    }

    const newFolder: DesignFolder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      description: newFolderDescription.trim() || undefined,
      color: selectedColor,
      designCount: 0,
      createdAt: new Date(),
    };

    setFolders([...folders, newFolder]);
    setShowNewFolderModal(false);
    setNewFolderName('');
    setNewFolderDescription('');
    setSelectedColor('#fef3c7');
    
    Alert.alert('✅ Carpeta creada', `"${newFolder.name}" fue creada correctamente`);
  };

  const handleDeleteFolder = (folderId: string, folderName: string) => {
    Alert.alert(
      'Eliminar carpeta',
      `¿Estás seguro de eliminar "${folderName}"? Se eliminarán todos los diseños dentro.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setFolders(folders.filter(f => f.id !== folderId));
          },
        },
      ]
    );
  };

  const renderFolder = ({ item }: { item: DesignFolder }) => (
    <TouchableOpacity 
      style={styles.folderCard}
      onPress={() => navigation.navigate('FolderDetail', {
        folderId: item.id,
        folderName: item.name,
        folderColor: item.color,
      })}
      onLongPress={() => handleDeleteFolder(item.id, item.name)}
    >
      <View style={[styles.folderIcon, { backgroundColor: item.color }]}>
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

  const totalDesigns = folders.reduce((sum, f) => sum + f.designCount, 0);

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowNewFolderModal(true)}
        >
          <Text style={styles.addButtonText}>+ Carpeta</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{folders.length}</Text>
          <Text style={styles.statLabel}>Carpetas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalDesigns}</Text>
          <Text style={styles.statLabel}>Diseños totales</Text>
        </View>
      </View>

      <FlatList
        data={folders}
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
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setShowNewFolderModal(true)}
            >
              <Text style={styles.emptyButtonText}>+ Crear carpeta</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modal Nueva Carpeta */}
      <Modal
        visible={showNewFolderModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowNewFolderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Carpeta</Text>

            <Text style={styles.inputLabel}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Vikingos, Amor, Tribal..."
              placeholderTextColor="#999"
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
            />

            <Text style={styles.inputLabel}>Descripción</Text>
            <TextInput
              style={styles.input}
              placeholder="Opcional"
              placeholderTextColor="#999"
              value={newFolderDescription}
              onChangeText={setNewFolderDescription}
            />

            <Text style={styles.inputLabel}>Color</Text>
            <View style={styles.colorPicker}>
              {colors.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Text style={styles.colorCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowNewFolderModal(false);
                  setNewFolderName('');
                  setNewFolderDescription('');
                  setSelectedColor('#fef3c7');
                }}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCreateButton}
                onPress={handleCreateFolder}
              >
                <Text style={styles.modalCreateText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderColor: '#000',
    borderWidth: 3,
  },
  colorCheck: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  modalCreateButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  modalCreateText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});