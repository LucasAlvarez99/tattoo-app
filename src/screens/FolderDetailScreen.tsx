import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { getDesignsByFolder, createDesign, updateDesign, deleteDesign } from '../lib/catalogService';
import { DesignImage } from '../lib/mockData';
import SafeScreen from '../components/SafeScreen';
import * as ImagePicker from 'expo-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'FolderDetail'>;

const { width } = Dimensions.get('window');
const imageSize = (width - 60) / 3;

export default function FolderDetailScreen({ route, navigation }: Props) {
  const { folderId, folderName, folderColor } = route.params;
  
  const [designs, setDesigns] = useState<DesignImage[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<DesignImage | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDesignName, setNewDesignName] = useState('');
  const [newDesignNotes, setNewDesignNotes] = useState('');
  const [newDesignPrice, setNewDesignPrice] = useState('');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadDesigns();
    }, [folderId])
  );

  const loadDesigns = async () => {
    try {
      const designsList = await getDesignsByFolder(folderId);
      setDesigns(designsList);
    } catch (error) {
      console.error('Error cargando diseños:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDesigns();
    setRefreshing(false);
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para agregar fotos');
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images', // ✅ Correcto: usar string en lugar de enum
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
        setShowAddModal(true);
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
        setShowAddModal(true);
      }
    } catch (error) {
      console.error('Error tomando foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const handlePickImage = () => {
    Alert.alert(
      'Seleccionar imagen',
      '¿De dónde quieres agregar la imagen?',
      [
        { text: 'Galería', onPress: () => pickImageFromGallery() },
        { text: 'Cámara', onPress: () => takePhoto() },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleSaveDesign = async () => {
    if (!selectedImageUri) {
      Alert.alert('Error', 'Primero selecciona una imagen');
      return;
    }

    try {
      await createDesign({
        folderId,
        uri: selectedImageUri,
        name: newDesignName.trim() || undefined,
        notes: newDesignNotes.trim() || undefined,
        referencePrice: newDesignPrice ? parseFloat(newDesignPrice) : undefined,
      });

      setShowAddModal(false);
      setNewDesignName('');
      setNewDesignNotes('');
      setNewDesignPrice('');
      setSelectedImageUri(null);
      
      await loadDesigns();
      Alert.alert('✅ Imagen agregada', 'El diseño se agregó correctamente');
    } catch (error) {
      console.error('Error guardando diseño:', error);
      Alert.alert('Error', 'No se pudo guardar el diseño');
    }
  };

  const handleDeleteDesign = (designId: string) => {
    Alert.alert(
      'Eliminar diseño',
      '¿Estás seguro de eliminar este diseño?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDesign(designId);
              setSelectedDesign(null);
              await loadDesigns();
              Alert.alert('✅ Eliminado', 'El diseño se eliminó correctamente');
            } catch (error) {
              console.error('Error eliminando diseño:', error);
              Alert.alert('Error', 'No se pudo eliminar el diseño');
            }
          },
        },
      ]
    );
  };

  const renderDesign = ({ item }: { item: DesignImage }) => (
    <TouchableOpacity
      style={styles.designCard}
      onPress={() => setSelectedDesign(item)}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.designImage}
        resizeMode="cover"
      />
      {item.referencePrice && (
        <View style={styles.priceTag}>
          <Text style={styles.priceTagText}>
            ${item.referencePrice.toLocaleString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeScreen edges={['top', 'left', 'right']} backgroundColor="#f9fafb">
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>‹ Atrás</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <View style={[styles.folderIcon, { backgroundColor: folderColor }]}>
            <Text style={styles.folderIconText}>📁</Text>
          </View>
          <Text style={styles.folderName} numberOfLines={1}>{folderName}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.designCount}>{designs.length}</Text>
        </View>
      </View>

      <FlatList
        data={designs}
        renderItem={renderDesign}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🎨</Text>
            <Text style={styles.emptyStateText}>No hay diseños aún</Text>
            <Text style={styles.emptyStateSubtext}>
              Agregá tu primer diseño a esta carpeta
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handlePickImage}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal Agregar diseño */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setShowAddModal(false);
          setSelectedImageUri(null);
          setNewDesignName('');
          setNewDesignNotes('');
          setNewDesignPrice('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Diseño</Text>

            {selectedImageUri ? (
              <>
                <View style={styles.imagePreview}>
                  <Image
                    source={{ uri: selectedImageUri }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.changeImageButton}
                    onPress={handlePickImage}
                  >
                    <Text style={styles.changeImageText}>Cambiar imagen</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Nombre (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Dragón tribal"
                  placeholderTextColor="#999"
                  value={newDesignName}
                  onChangeText={setNewDesignName}
                />

                <Text style={styles.inputLabel}>Notas (opcional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Detalles del diseño..."
                  placeholderTextColor="#999"
                  value={newDesignNotes}
                  onChangeText={setNewDesignNotes}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />

                <Text style={styles.inputLabel}>Precio referencia (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="25000"
                  placeholderTextColor="#999"
                  value={newDesignPrice}
                  onChangeText={setNewDesignPrice}
                  keyboardType="numeric"
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => {
                      setShowAddModal(false);
                      setSelectedImageUri(null);
                      setNewDesignName('');
                      setNewDesignNotes('');
                      setNewDesignPrice('');
                    }}
                  >
                    <Text style={styles.modalCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalCreateButton}
                    onPress={handleSaveDesign}
                  >
                    <Text style={styles.modalCreateText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.imagePickerButton}
                  onPress={handlePickImage}
                >
                  <Text style={styles.imagePickerIcon}>📷</Text>
                  <Text style={styles.imagePickerText}>Seleccionar imagen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal Detalle del diseño */}
      <Modal
        visible={selectedDesign !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedDesign(null)}
      >
        <View style={styles.detailModalOverlay}>
          <TouchableOpacity
            style={styles.detailModalBackground}
            activeOpacity={1}
            onPress={() => setSelectedDesign(null)}
          />
          <View style={styles.detailModalContent}>
            {selectedDesign && (
              <>
                <Image
                  source={{ uri: selectedDesign.uri }}
                  style={styles.detailImage}
                  resizeMode="contain"
                />
                
                <View style={styles.detailInfo}>
                  {selectedDesign.name && (
                    <Text style={styles.detailName}>{selectedDesign.name}</Text>
                  )}
                  
                  {selectedDesign.notes && (
                    <Text style={styles.detailNotes}>{selectedDesign.notes}</Text>
                  )}
                  
                  {selectedDesign.referencePrice && (
                    <Text style={styles.detailPrice}>
                      Precio referencia: ${selectedDesign.referencePrice.toLocaleString()}
                    </Text>
                  )}

                  <Text style={styles.detailDate}>
                    Agregado: {new Date(selectedDesign.createdAt).toLocaleDateString('es-AR')}
                  </Text>

                  <View style={styles.detailActions}>
                    <TouchableOpacity
                      style={styles.detailActionButton}
                      onPress={() => {
                        setSelectedDesign(null);
                        Alert.alert('Compartir', 'Funcionalidad próximamente');
                      }}
                    >
                      <Text style={styles.detailActionText}>📤 Compartir</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.detailActionButton, styles.detailActionButtonDanger]}
                      onPress={() => handleDeleteDesign(selectedDesign.id)}
                    >
                      <Text style={[styles.detailActionText, styles.detailActionTextDanger]}>
                        🗑️ Eliminar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    width: 80,
  },
  backButton: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  folderIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  folderIconText: {
    fontSize: 18,
  },
  folderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    maxWidth: 150,
  },
  headerRight: {
    width: 80,
    alignItems: 'flex-end',
  },
  designCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  grid: {
    padding: 15,
    paddingBottom: 100,
  },
  row: {
    gap: 15,
    marginBottom: 15,
  },
  designCard: {
    width: imageSize,
    height: imageSize,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  designImage: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceTagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
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
    bottom: 90,
    backgroundColor: '#000',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
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
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    marginBottom: 20,
    gap: 12,
  },
  imagePickerIcon: {
    fontSize: 32,
  },
  imagePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  imagePreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  changeImageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  changeImageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
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
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailModalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  detailModalContent: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  detailImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f3f4f6',
  },
  detailInfo: {
    padding: 20,
  },
  detailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  detailNotes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  detailPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  detailDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailActionButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  detailActionButtonDanger: {
    backgroundColor: '#fee2e2',
  },
  detailActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  detailActionTextDanger: {
    color: '#ef4444',
  },
});