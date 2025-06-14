import { DrawerIconButton } from '@/components/DrawerButton';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const FILTERS = [
  { 
    label: 'Announcements', 
    key: 'announcements', 
    icon: 'megaphone',
    color: '#3B82F6' 
  },
  { 
    label: 'Board Meetings', 
    key: 'board_meetings', 
    icon: 'people',
    color: '#8B5CF6' 
  },
  { 
    label: 'Bonus', 
    key: 'bonus', 
    icon: 'gift',
    color: '#10B981' 
  },
  { 
    label: 'Dividends', 
    key: 'dividends', 
    icon: 'cash',
    color: '#F59E0B' 
  },
  { 
    label: 'Splits', 
    key: 'splits', 
    icon: 'git-branch',
    color: '#EF4444' 
  },
  { 
    label: 'AGM/EGM', 
    key: 'annual_general_meeting', 
    icon: 'business',
    color: '#06B6D4' 
  },
  { 
    label: 'Rights', 
    key: 'rights', 
    icon: 'key',
    color: '#84CC16' 
  },
];

interface CorporateActionItem {
  name?: string;
  companyName?: string;
  date1?: string;
  date?: string;
  LTP?: string;
  [key: string]: any;
}

export default function CorporateActionScreen() {
  const [activeFilter, setActiveFilter] = useState<string>('announcements');
  const [items, setItems] = useState<CorporateActionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<CorporateActionItem | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://pridecons.sbs/corporate-action?key=${activeFilter}`
      );
      setItems(data.data || []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const openModal = (item: CorporateActionItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const getFilterConfig = () => {
    return FILTERS.find(f => f.key === activeFilter) || FILTERS[0];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getActionTypeIcon = (type: string) => {
    const filter = FILTERS.find(f => f.key === type);
    return filter ? filter.icon : 'document-text';
  };

  const getActionTypeColor = (type: string) => {
    const filter = FILTERS.find(f => f.key === type);
    return filter ? filter.color : '#667EEA';
  };

  const FilterChip = ({ filter, isActive }: { filter: any; isActive: boolean }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        isActive && styles.filterChipActive,
        { borderColor: filter.color }
      ]}
      onPress={() => setActiveFilter(filter.key)}
      activeOpacity={0.8}
    >
      <View style={styles.filterChipContent}>
        <Icon 
          name={filter.icon} 
          size={16} 
          color={isActive ? '#FFFFFF' : filter.color} 
          style={styles.filterIcon}
        />
        <Text style={[
          styles.filterText,
          isActive && styles.filterTextActive,
          !isActive && { color: filter.color }
        ]}>
          {filter.label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const CorporateActionCard = ({ item }: { item: CorporateActionItem }) => {
    const filterConfig = getFilterConfig();
    const companyName = item.name || item.stockName ;
    const actionDate = item.date1 || item.creationtime;

    return (
      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => openModal(item)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.cardGradient}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.actionIcon, { backgroundColor: filterConfig.color }]}>
                <Icon name={filterConfig.icon} size={20} color="#FFFFFF" />
              </View>
              <View style={styles.companyInfo}>
                <Text style={styles.companyName} numberOfLines={2}>
                  {companyName}
                </Text>
                <Text style={styles.actionType}>
                  {filterConfig.label}
                </Text>
              </View>
            </View>
            <View style={styles.cardHeaderRight}>
              <Text style={styles.actionDate}>
                {actionDate}
              </Text>
              <Icon name="chevron-forward" size={16} color="#94A3B8" />
            </View>
          </View>

          {/* Card Body */}
          <View style={styles.cardBody}>
            {item.LTP && (
              <View style={styles.ltpContainer}>
                <Text style={styles.ltpLabel}>Last Traded Price</Text>
                <Text style={styles.ltpValue}>₹{item.LTP}</Text>
              </View>
            )}

            {/* Additional Info */}
            <View style={styles.additionalInfo}>
              {Object.entries(item).slice(0, 3).map(([key, value]) => {
                if (key === 'name' || key === 'companyName' || key === 'date1' || 
                    key === 'date' || key === 'LTP' || !value) return null;
                
                return (
                  <View key={key} style={styles.infoItem}>
                    <Text style={styles.infoLabel}>
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </Text>
                    <Text style={styles.infoValue} numberOfLines={1}>
                      {String(value)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Card Footer */}
          <View style={styles.cardFooter}>
            <Text style={styles.viewDetailsText}>Tap to view details</Text>
            <Icon name="information-circle" size={16} color="#667EEA" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => {
    const filterConfig = getFilterConfig();
    
    return (
      <View style={styles.emptyState}>
        <View style={[styles.emptyIcon, { backgroundColor: filterConfig.color }]}>
          <Icon name={filterConfig.icon} size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.emptyTitle}>No {filterConfig.label} Found</Text>
        <Text style={styles.emptySubtitle}>
          There are no {filterConfig.label.toLowerCase()} available at the moment.
        </Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Icon name="refresh" size={20} color="#667EEA" />
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const DetailModal = () => {
    if (!selectedItem) return null;

    const filterConfig = getFilterConfig();
    const companyName = selectedItem.name || selectedItem.stockName;

    // Filter out common fields that are already displayed
    const detailFields = Object.entries(selectedItem).filter(([key, value]) => {
      return key !== 'name' && key !== 'companyName' && value !== null && value !== undefined && value !== '';
    });

    return (
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={[styles.modalIcon, { backgroundColor: filterConfig.color }]}>
                  <Icon name={filterConfig.icon} size={24} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.modalTitle} numberOfLines={2}>
                    {companyName}
                  </Text>
                  <Text style={styles.modalSubtitle}>
                    {filterConfig.label} Details
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Icon name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {detailFields.length > 0 ? (
                detailFields.map(([key, value], index) => (
                  <View key={key} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                    <Text style={styles.detailValue}>
                      {String(value)}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.noDetailsContainer}>
                  <Icon name="document-text-outline" size={48} color="#94A3B8" />
                  <Text style={styles.noDetailsText}>No additional details available</Text>
                </View>
              )}
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        
        {/* Header */}
        <View style={styles.header}>
          <DrawerIconButton size={24} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Corporate Actions</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshIconButton}>
            <Icon name="refresh" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {FILTERS.map(filter => (
              <FilterChip
                key={filter.key}
                filter={filter}
                isActive={activeFilter === filter.key}
              />
            ))}
          </ScrollView>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Icon name={getFilterConfig().icon} size={20} color="#667EEA" />
              <Text style={styles.sectionTitle}>
                {getFilterConfig().label}
              </Text>
            </View>
            {items.length > 0 && (
              <Text style={styles.countBadge}>{items.length}</Text>
            )}
          </View>

          {/* Content */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#667EEA" />
              <Text style={styles.loadingText}>Loading corporate actions...</Text>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(_, index) => String(index)}
              renderItem={({ item }) => <CorporateActionCard item={item} />}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh}
                  tintColor="#667EEA"
                  colors={['#667EEA']}
                />
              }
              ListEmptyComponent={EmptyState}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Detail Modal */}
        <DetailModal />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  refreshIconButton: {
    padding: 4,
  },
  filterSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 12,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  filterChipActive: {
    backgroundColor: '#667EEA',
    borderColor: '#667EEA',
  },
  filterChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  contentSection: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  countBadge: {
    backgroundColor: '#667EEA',
    color: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#94A3B8',
  },
  listContent: {
    flexGrow: 1,
  },
  actionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionType: {
    fontSize: 12,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  actionDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardBody: {
    marginBottom: 16,
  },
  ltpContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  ltpLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 2,
  },
  ltpValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  additionalInfo: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 2,
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#667EEA',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#667EEA',
  },
  refreshButtonText: {
    marginLeft: 8,
    color: '#667EEA',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    maxHeight: height * 0.8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
  },
  modalBody: {
    padding: 20,
    marginBottom:2
  },
  detailRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    lineHeight: 24,
  },
  noDetailsContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  noDetailsText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  modalCloseButton: {
    backgroundColor: '#667EEA',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});