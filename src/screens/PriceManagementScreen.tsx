import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import {
  mockPriceCategories,
  PriceCategory,
  PriceItem,
  updatePriceItem,
  addPriceItem,
  deletePriceItem,
  addPriceCategory,
  updatePriceCategory,
  deletePriceCategory,
} from '../lib/mockData';
import SafeScreen from '../components/SafeScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'PriceManagement'>;

type EditMode = 'none' | 'category' | 'item';

export default function PriceManagementScreen({ navigation }: Props) {
  const [categories, setCategories] = useState<PriceCategory[]>(mockPriceCategories);
  const [editMode, setEditMode] = useState<EditMode>('none');
  const [editingCategory, setEditingCategory] = useState<PriceCategory | null>(null);
  const [editingItem, setEditingItem] = useState<PriceItem | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string>('');

  // Estados del formulario
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const refreshCategories = () => {
    setCategories([...mockPriceCategories]);
  };

  const handleEditItem = (category: PriceCategory, item: PriceItem) => {
    setEditingItem(item);
    setEditingCategoryId(category.id);
    setItemName(item.name);
    setItemPrice(item.basePrice.toString());
    setItemDescription(item.description || '');
    setEditMode('item');
  };

  const handleSaveItem = () => {
    if (!itemName.trim() || !itemPrice.trim()) {
      Alert.alert('Error', 'Nombre y precio son requeridos');
      return;
    }

    const price = parseFloat(itemPrice);
    if (isNaN(price) || price < 0) {
      Alert.alert('Error', 'Ingresá un precio válido');
      return;
    }

    if (editingItem) {
      // Editar existente
      updatePriceItem(editingCategoryId, editingItem.id, {
        name: itemName.trim(),
        basePrice: price,
        description: itemDescription.trim() || undefined,
      });
      Alert.alert('✅ Guardado', 'El precio se actualizó correctamente');
    } else {
      // Crear nuevo
      addPriceItem(editingCategoryId, {
        categoryId: editingCategoryId,
        name: itemName.trim(),
        basePrice: price,
        description: itemDescription.trim() || undefined,
        isActive: true,
      });
      Alert.alert('✅ Creado', 'El precio se agregó correctamente');
    }

    refreshCategories();
    closeModal();
  };

  const handleDeleteItem = (categoryId: string, itemId: string, itemName: string) => {
    Alert.alert(
      'Eliminar precio',
      `¿Estás seguro de eliminar "${itemName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deletePriceItem(categoryId, itemId);
            refreshCategories();
            Alert.alert('✅ Eliminado', 'El precio se eliminó correctamente');
          },
        },
      ]
    );
  };

  const handleNewItem = (categoryId: string) => {
    setEditingItem(null);
    setEditingCategoryId(categoryId);
    setItemName('');
    setItemPrice('');
    setItemDescription('');
    setEditMode('item');
  };

  const handleEditCategory = (category: PriceCategory) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || '');
    setEditMode('category');
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) {
      Alert.alert('Error', 'El nombre de la categoría es requerido');
      return;
    }

    if (editingCategory) {
      // Editar existente
      updatePriceCategory(editingCategory.id, {
        name: categoryName.trim(),
        description: categoryDescription.trim() || undefined,
      });
      Alert.alert('✅ Guardado', 'La categoría se actualizó correctamente');
    } else {
      // Crear nueva
      addPriceCategory({
        name: categoryName.trim(),
        description: categoryDescription.trim() || undefined,
        items: [],
        isActive: true,
      });
      Alert.alert('✅ Creada', 'La categoría se creó correctamente');
    }

    refreshCategories();
    closeModal();
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && category.items.length > 0) {
      Alert.alert(
        'No se puede eliminar',
        'Esta categoría tiene precios asociados. Eliminá primero todos los precios.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Eliminar categoría',
      `¿Estás seguro de eliminar "${categoryName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deletePriceCategory(categoryId);
            refreshCategories();
            Alert.alert('✅ Eliminada', 'La categoría se eliminó correctamente');
          },
        },
      ]
    );
  };

  const toggleCategoryActive = (categoryId: string, currentState: boolean) => {
    updatePriceCategory(categoryId, { isActive: !currentState });
    refreshCategories();
  };

  const toggleItemActive = (categoryId: string, itemId: string, currentState: boolean) => {
    updatePriceItem(categoryId, itemId, { isActive: !currentState });
    refreshCategories();
  };

  const closeModal = () => {
    setEditMode('none');
    setEditingCategory(null);
    setEditingItem(null);
    setEditingCategoryId('');
    setItemName('');
    setItemPrice('');
    setItemDescription('');
    setCategoryName('');
    setCategoryDescription('');
  };

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lista de Precios</Text>
        <TouchableOpacity onPress={() => handleEditCategory(null as any)}>
          <Text style={styles.addButton}>+ Categoría</Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={styles.infoText}>
          Personalizá tus precios según tu método de cotización. Podés crear categorías por pieza, por sesión, por tamaño, etc.
        </Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {categories.map(category => (
          <View key={category.id} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryHeaderLeft}>
                <Text style={styles.categoryName}>{category.name}</Text>
                {category.description && (
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                )}
                <Text style={styles.categoryCount}>
                  {category.items.length} {category.items.length === 1 ? 'precio' : 'precios'}
                </Text>
              </View>
              <View style={styles.categoryHeaderRight}>
                <Switch
                  value={category.isActive}
                  onValueChange={() => toggleCategoryActive(category.id, category.isActive)}
                />
              </View>
            </View>

            <View style={styles.categoryActions}>
              <TouchableOpacity
                style={styles.categoryActionButton}
                onPress={() => handleEditCategory(category)}
              >
                <Text style={styles.categoryActionText}>✏️ Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.categoryActionButton}
                onPress={() => handleNewItem(category.id)}
              >
                <Text style={styles.categoryActionText}>+ Agregar precio</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryActionButton, styles.categoryActionButtonDanger]}
                onPress={() => handleDeleteCategory(category.id, category.name)}
              >
                <Text style={[styles.categoryActionText, styles.categoryActionTextDanger]}>
                  🗑️
                </Text>
              </TouchableOpacity>
            </View>

            {/* Items */}
            {category.items.map(item => (
              <View
                key={item.id}
                style={[styles.priceItem, !item.isActive && styles.priceItemInactive]}
              >
                <View style={styles.priceItemLeft}>
                  <Switch
                    value={item.isActive}
                    onValueChange={() =>
                      toggleItemActive(category.id, item.id, item.isActive)
                    }
                  />
                </View>
                <View style={styles.priceItemCenter}>
                  <Text style={[styles.priceItemName, !item.isActive && styles.textInactive]}>
                    {item.name}
                  </Text>
                  {item.description && (
                    <Text style={styles.priceItemDescription}>{item.description}</Text>
                  )}
                </View>
                <View style={styles.priceItemRight}>
                  <Text style={[styles.priceItemPrice, !item.isActive && styles.textInactive]}>
                    ${item.basePrice.toLocaleString()}
                  </Text>
                  <View style={styles.priceItemActions}>
                    <TouchableOpacity onPress={() => handleEditItem(category, item)}>
                      <Text style={styles.priceItemActionText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteItem(category.id, item.id, item.name)}
                    >
                      <Text style={[styles.priceItemActionText, styles.deleteAction]}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {category.items.length === 0 && (
              <View style={styles.emptyCategory}>
                <Text style={styles.emptyCategoryText}>Sin precios en esta categoría</Text>
                <TouchableOpacity
                  style={styles.emptyCategoryButton}
                  onPress={() => handleNewItem(category.id)}
                >
                  <Text style={styles.emptyCategoryButtonText}>+ Agregar el primero</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal Editar/Crear Item */}
      <Modal
        visible={editMode === 'item'}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Editar Precio' : 'Nuevo Precio'}
            </Text>

            <Text style={styles.inputLabel}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Brazo completo, Sesión 2hs, Mediano..."
              placeholderTextColor="#999"
              value={itemName}
              onChangeText={setItemName}
              autoFocus
            />

            <Text style={styles.inputLabel}>Precio ($) *</Text>
            <TextInput
              style={styles.input}
              placeholder="25000"
              placeholderTextColor="#999"
              value={itemPrice}
              onChangeText={setItemPrice}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Descripción (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detalles adicionales..."
              placeholderTextColor="#999"
              value={itemDescription}
              onChangeText={setItemDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={closeModal}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveItem}>
                <Text style={styles.modalSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Editar/Crear Categoría */}
      <Modal
        visible={editMode === 'category'}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </Text>

            <Text style={styles.inputLabel}>Nombre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Por Pieza, Por Sesión, Por Estilo..."
              placeholderTextColor="#999"
              value={categoryName}
              onChangeText={setCategoryName}
              autoFocus
            />

            <Text style={styles.inputLabel}>Descripción (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Cómo funciona esta categoría..."
              placeholderTextColor="#999"
              value={categoryDescription}
              onChangeText={setCategoryDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.infoBoxModal}>
              <Text style={styles.infoIconModal}>💡</Text>
              <Text style={styles.infoTextModal}>
                Después de crear la categoría, podés agregar precios individuales
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={closeModal}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveCategory}>
                <Text style={styles.modalSaveText}>Guardar</Text>
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
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  addButton: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 12,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#0369a1',
    lineHeight: 18,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  categorySection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  categoryHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  categoryHeaderRight: {
    marginTop: 4,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryActionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  categoryActionButtonDanger: {
    flex: 0,
    width: 50,
  },
  categoryActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  categoryActionTextDanger: {
    color: '#ef4444',
  },
  priceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  priceItemInactive: {
    opacity: 0.5,
  },
  priceItemLeft: {
    marginRight: 12,
  },
  priceItemCenter: {
    flex: 1,
  },
  priceItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  priceItemDescription: {
    fontSize: 12,
    color: '#666',
  },
  priceItemRight: {
    alignItems: 'flex-end',
  },
  priceItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  priceItemActions: {
    flexDirection: 'row',
    gap: 12,
  },
  priceItemActionText: {
    fontSize: 18,
  },
  deleteAction: {
    opacity: 0.6,
  },
  textInactive: {
    color: '#999',
  },
  emptyCategory: {
    padding: 24,
    alignItems: 'center',
  },
  emptyCategoryText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  emptyCategoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  emptyCategoryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
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
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  infoBoxModal: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
    marginTop: 16,
  },
  infoIconModal: {
    fontSize: 18,
    marginRight: 8,
  },
  infoTextModal: {
    flex: 1,
    fontSize: 12,
    color: '#0369a1',
    lineHeight: 16,
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
  modalSaveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});