import { DrawerIconButton } from '@/components/DrawerButton';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

interface CalendarItem {
  Company: string;
  Event: string;
  Date1: string;
  Date2: string;
  [key: string]: any;
}

const EVENT_ICONS: { [key: string]: { icon: string; color: string } } = {
  'Dividend': { icon: 'cash', color: '#10B981' },
  'Bonus': { icon: 'gift', color: '#F59E0B' },
  'Split': { icon: 'git-branch', color: '#EF4444' },
  'Rights': { icon: 'key', color: '#8B5CF6' },
  'AGM': { icon: 'people', color: '#06B6D4' },
  'EGM': { icon: 'business', color: '#84CC16' },
  'Board Meeting': { icon: 'calendar', color: '#3B82F6' },
  'Result': { icon: 'document-text', color: '#F97316' },
  'Annual Report': { icon: 'library', color: '#6366F1' },
  'Default': { icon: 'calendar-outline', color: '#64748B' },
};

export default function CorporateCalendarScreen() {
  const [data, setData] = useState<CalendarItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('All Events');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://pridecons.sbs/corporate-calendar');
      setData(res.data.data || []);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const eventTypes = useMemo(() => {
    const types = Array.from(new Set(data.map(item => item.Event)));
    return ['All Events', ...types.sort()];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.Company
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesEvent =
        selectedEvent === 'All Events' || item.Event === selectedEvent;
      return matchesSearch && matchesEvent;
    });
  }, [data, searchTerm, selectedEvent]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedEvent('All Events');
  };

  const getEventIcon = (eventType: string) => {
    const eventKey = Object.keys(EVENT_ICONS).find(key => 
      eventType.toLowerCase().includes(key.toLowerCase())
    );
    return EVENT_ICONS[eventKey || 'Default'];
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

  const getEventBadgeColor = (eventType: string) => {
    const { color } = getEventIcon(eventType);
    return color;
  };

  const EventFilterChip = ({ eventType, isActive }: { eventType: string; isActive: boolean }) => {
    const { icon, color } = getEventIcon(eventType);
    
    return (
      <TouchableOpacity
        style={[
          styles.eventChip,
          isActive && { backgroundColor: color, borderColor: color }
        ]}
        onPress={() => setSelectedEvent(eventType)}
        activeOpacity={0.8}
      >
        <Icon 
          name={icon} 
          size={16} 
          color={isActive ? '#FFFFFF' : color} 
          style={styles.chipIcon}
        />
        <Text style={[
          styles.chipText,
          { color: isActive ? '#FFFFFF' : color }
        ]}>
          {eventType}
        </Text>
      </TouchableOpacity>
    );
  };

  const CalendarCard = ({ item }: { item: CalendarItem }) => {
    const { icon, color } = getEventIcon(item.Event);

    return (
      <View style={styles.calendarCard}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.cardGradient}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.eventIcon, { backgroundColor: color }]}>
                <Icon name={icon} size={20} color="#FFFFFF" />
              </View>
              <View style={styles.companyInfo}>
                <Text style={styles.companyName} numberOfLines={2}>
                  {item.Company}
                </Text>
                <View style={styles.eventBadge}>
                  <Text style={[styles.eventText, { color }]}>
                    {item.Event}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Card Body */}
          <View style={styles.cardBody}>
            <View style={styles.dateSection}>
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>Announced Date</Text>
                <Text style={styles.dateValue}>
                  {item.Date1}
                </Text>
              </View>
              <View style={styles.dateDivider} />
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>Ex-Date</Text>
                <Text style={styles.dateValue}>
                  {item.Date2}
                </Text>
              </View>
            </View>
          </View>

          {/* Card Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: color }]} />
              <Text style={styles.statusText}>Active Event</Text>
            </View>
            <Icon name="chevron-forward" size={16} color="#64748B" />
          </View>
        </LinearGradient>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Icon name="calendar-outline" size={64} color="#475569" />
      </View>
      <Text style={styles.emptyTitle}>No Events Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchTerm || selectedEvent !== 'All Events' 
          ? 'Try adjusting your search or filter criteria'
          : 'No corporate events are currently scheduled'
        }
      </Text>
      {(searchTerm || selectedEvent !== 'All Events') && (
        <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
          <Icon name="refresh" size={20} color="#667EEA" />
          <Text style={styles.clearFiltersText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const FilterModal = () => (
    showFilters && (
      <View style={styles.filterModal}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.filterContent}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filter Events</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Icon name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.filterBody}>
            <Text style={styles.filterSectionTitle}>Event Types</Text>
            <View style={styles.eventChipsContainer}>
              {eventTypes.map(eventType => (
                <EventFilterChip
                  key={eventType}
                  eventType={eventType}
                  isActive={selectedEvent === eventType}
                />
              ))}
            </View>
          </ScrollView>
          
          <View style={styles.filterFooter}>
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton} 
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  );

  return (
    <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        
        {/* Header */}
        <View style={styles.header}>
          <DrawerIconButton size={24} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Corporate Calendar</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshIconButton}>
            <Icon name="refresh" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search & Filter Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search companies..."
              placeholderTextColor="#64748B"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
                <Icon name="close-circle" size={20} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => setShowFilters(true)}
          >
            <Icon name="options" size={20} color="#667EEA" />
            {selectedEvent !== 'All Events' && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>1</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Active Filters */}
        {selectedEvent !== 'All Events' && (
          <View style={styles.activeFiltersSection}>
            <Text style={styles.activeFiltersLabel}>Active Filters:</Text>
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>{selectedEvent}</Text>
              <TouchableOpacity onPress={() => setSelectedEvent('All Events')}>
                <Icon name="close" size={16} color="#667EEA" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredData.length}</Text>
            <Text style={styles.statLabel}>Events Found</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{eventTypes.length - 1}</Text>
            <Text style={styles.statLabel}>Event Types</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{data.length}</Text>
            <Text style={styles.statLabel}>Total Events</Text>
          </View>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667EEA" />
            <Text style={styles.loadingText}>Loading corporate calendar...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(_, index) => String(index)}
            renderItem={({ item }) => <CalendarCard item={item} />}
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

        {/* Filter Modal */}
        <FilterModal />
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
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#FFFFFF',
    fontSize: 16,
  },
  clearSearchButton: {
    padding: 4,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#667EEA',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  activeFiltersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  activeFiltersLabel: {
    color: '#94A3B8',
    fontSize: 14,
    marginRight: 8,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667EEA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
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
    padding: 16,
    flexGrow: 1,
  },
  calendarCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eventIcon: {
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
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  eventBadge: {
    alignSelf: 'flex-start',
  },
  eventText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardBody: {
    marginBottom: 16,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateItem: {
    flex: 1,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#94A3B8',
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
    backgroundColor: 'rgba(71, 85, 105, 0.2)',
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
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#667EEA',
  },
  clearFiltersText: {
    marginLeft: 8,
    color: '#667EEA',
    fontWeight: '600',
  },
  filterModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  filterContent: {
    backgroundColor: '#FFFFFF',
    maxHeight: height * 0.6,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  filterBody: {
    padding: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  eventChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  eventChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    marginBottom: 8,
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#667EEA',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});