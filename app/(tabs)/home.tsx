import { formatFullDate } from "@/helper/helper";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

interface ResearchItem {
  id: number;
  title: string;
  author: string;
  timestamp: string;
  message: string;
  category?: string;
  tags?: string[];
}

// Date Filter Modal Component
const DateFilterModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onApply: (filter: string) => void;
  currentFilter: string;
}> = ({ visible, onClose, onApply, currentFilter }) => {
  const dateOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'Last 3 Months', value: '3months' },
    { label: 'Last 6 Months', value: '6months' },
    { label: 'This Year', value: 'year' }
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter by Date</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#667eea" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            {dateOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.filterOption,
                  currentFilter === option.value && styles.activeFilterOption
                ]}
                onPress={() => {
                  onApply(option.value);
                  onClose();
                }}
              >
                <Text style={[
                  styles.filterOptionText,
                  currentFilter === option.value && styles.activeFilterOptionText
                ]}>
                  {option.label}
                </Text>
                {currentFilter === option.value && (
                  <Icon name="checkmark" size={20} color="#667eea" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Enhanced Research Card
const ResearchCard: React.FC<{ item: ResearchItem; index: number }> = ({ item, index }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          }, {
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.95, 1],
            }),
          }],
        },
      ]}
    >
      <TouchableOpacity style={styles.card} activeOpacity={0.85}>
        <LinearGradient
          colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.avatarContainer}
            >
              <Text style={styles.avatarText}>
                {item.author
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()}
              </Text>
            </LinearGradient>
            <View style={styles.headerInfo}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.metaContainer}>
                <Icon name="person-outline" size={12} color="#9ca3af" />
                <Text style={styles.author}>Pride Research</Text>
                <View style={styles.metaDot} />
              </View>
            </View>
          </View>
          
          <Text style={styles.message} numberOfLines={4}>
            {item.message}
          </Text>
          
          <View style={styles.cardFooter}>
            <TouchableOpacity
              onPress={() => navigation.navigate('disclosure')}
              style={styles.disclosureButton}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.tagGradient}
              >
                <Icon name="document-text-outline" size={14} color="#fff" />
                <Text style={styles.tagText}>Disclosure</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.metaContainer}>
                <Icon name="time-outline" size={12} color="#9ca3af" />
                <Text style={styles.timestamp}>{formatFullDate(item.timestamp)}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Enhanced Research Report Card
const ResearchReportCard: React.FC<{ report: any; index: number }> = ({ report, index }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
      useNativeDriver: true,
    }).start();
  }, []);

const downloadPdf = async (fileKey: string) => {
  const url = `https://d12p872xp7spmg.cloudfront.net/${fileKey}`;
  // 1. sanitize fileKey into a safe filename
  const safeName = fileKey.replace(/[/\\?%*:|"<>]/g, '-');
  const dir = FileSystem.documentDirectory! + 'researchReport/';

  try {
    // 2. ensure your local folder exists
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }

    // 3. build a local file:// URI
    const localUri = dir + safeName;

    // 4. download into that path (this yields a valid PDF)
    const { uri } = await FileSystem.downloadAsync(url, localUri);
    console.log('Downloaded to:', uri);

    // 5. now let the user open/share it
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
      });
    } else {
      // fallback: on Android, you could launch an intent instead
      Alert.alert('Downloaded', `Saved to:\n${uri}`);
    }
  } catch (err: any) {
    console.error('Download failed:', err);
    Alert.alert('Error', 'Unable to download PDF. Please try again.');
  }
};

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: animatedValue,
          transform: [{
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          }],
        },
      ]}
    >
      <TouchableOpacity style={styles.reportCard} activeOpacity={0.85}>
        <LinearGradient
          colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']}
          style={styles.reportCardGradient}
        >
          <View style={styles.reportHeader}>
            <View style={styles.reportIconContainer}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.reportIcon}
              >
                <Icon name="document-text" size={20} color="#fff" />
              </LinearGradient>
            </View>
            <View style={styles.reportHeaderInfo}>
              <Text style={styles.reportTitle}>{report.header.title}</Text>
              <View style={styles.reportMeta}>
                <Icon name="calendar-outline" size={12} color="#9ca3af" />
                <Text style={styles.reportDateTime}>
                  {formatFullDate(report.header.date)} at {report.header.time}
                </Text>
              </View>
              <View style={styles.reportAuthorContainer}>
                <Icon name="person-outline" size={12} color="#9ca3af" />
                <Text style={styles.reportAuthor}>{report.author}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.downloadButton} onPress={()=>downloadPdf(report?.fileKey)}>
              <Icon name="download-outline" size={20} color="#667eea" />
            </TouchableOpacity>
          </View>

          <View style={styles.stockPicksSection}>
            <Text style={styles.stockPicksTitle}>
              Stock Picks ({report.stockPicks.length})
            </Text>
            {report.stockPicks.slice(0, 2).map((stock: any, idx: number) => (
              <View key={idx} style={styles.stockPickContainer}>
                <View style={styles.stockHeader}>
                  <Text style={styles.stockName}>{stock.name}</Text>
                  <View style={styles.cmpContainer}>
                    <Text style={styles.cmpLabel}>CMP</Text>
                    <Text style={styles.cmpValue}>{stock.cmp}</Text>
                  </View>
                </View>
                <Text style={styles.stockCommentary}>{stock.commentary}</Text>
                <View style={styles.stockLevels}>
                  <View style={styles.levelItem}>
                    <Text style={styles.levelLabel}>Buy</Text>
                    <Text style={styles.levelValue}>{stock.buyLevel}</Text>
                  </View>
                  <View style={styles.levelItem}>
                    <Text style={styles.levelLabel}>Target 1</Text>
                    <Text style={styles.levelValue}>{stock.target1}</Text>
                  </View>
                  <View style={styles.levelItem}>
                    <Text style={styles.levelLabel}>Target 2</Text>
                    <Text style={styles.levelValue}>{stock.target2}</Text>
                  </View>
                  <View style={styles.levelItem}>
                    <Text style={styles.levelLabel}>Stop Loss</Text>
                    <Text style={styles.levelValueDanger}>{stock.stopLoss}</Text>
                  </View>
                </View>
              </View>
            ))}
            {report.stockPicks.length > 2 && (
              <Text style={styles.moreStocksText}>
                +{report.stockPicks.length - 2} more stocks
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const HomePage: React.FC = () => {
  const [data, setData] = useState<ResearchItem[]>([]);
  const [researchReport, setResearchReport] = useState<ResearchItem[]>([]);
  const [filteredData, setFilteredData] = useState<ResearchItem[]>([]);
  const [filteredReports, setFilteredReports] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [researchDateFilter, setResearchDateFilter] = useState<string>('all');
  const [reportsDateFilter, setReportsDateFilter] = useState<string>('all');
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'research' | 'reports'>('research');
  const [showDateFilter, setShowDateFilter] = useState<boolean>(false);

  useEffect(() => {
    fetchResearchData();
    fetchResearchReport();
  }, []);

  useEffect(() => {
    // Apply search and filter for research data
    let filtered = data;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q)
      );
    }
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => item.category === selectedFilter);
    }
    filtered = filterByDate(filtered, researchDateFilter);
    setFilteredData(filtered);
  }, [data, searchQuery, selectedFilter, researchDateFilter]);

  useEffect(() => {
    // Apply date filter for reports
    const filtered = filterByDate(researchReport, reportsDateFilter);
    setFilteredReports(filtered);
  }, [researchReport, reportsDateFilter]);

  const filterByDate = (items: ResearchItem[], dateFilter: string) => {
    if (dateFilter === 'all') return items;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return items.filter(item => {
      const itemDate = new Date(item.timestamp);
      
      switch (dateFilter) {
        case 'today':
          return itemDate >= today;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return itemDate >= monthAgo;
        case '3months':
          const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          return itemDate >= threeMonthsAgo;
        case '6months':
          const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          return itemDate >= sixMonthsAgo;
        case 'year':
          const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return itemDate >= yearAgo;
        default:
          return true;
      }
    });
  };

const fetchResearchData = async () => {
  try {
    setError('');
    const res = await axios.get<ResearchItem[]>(
      'http://192.168.30.216:8000/researcher/?skip=0&limit=100'
    );
    const dataArray = res.data ?? [];

    // Sort descending by timestamp (newest first)
    const sortedData = [...dataArray].sort((a, b) => {
      const tA = new Date(a.timestamp).getTime();
      const tB = new Date(b.timestamp).getTime();
      return tB - tA;
    });

    setData(sortedData);
  } catch (e: any) {
    console.error(e);
    setError('Failed to load research data');
    Alert.alert(
      'Error',
      'Unable to load research. Please check your connection and try again.'
    );
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  const fetchResearchReport = async () => {
    try {
      setError('');
      const res = await axios.get(
        'https://pridecons.sbs/pride/research-reports'
      );
      setResearchReport(res.data || []);
    } catch (e: any) {
      console.error(e);
      setError('Failed to load research data');
      Alert.alert('Error', 'Unable to load research. Try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    if(activeTab === 'research') fetchResearchData();
    else fetchResearchReport();
  };

  const getCurrentDateFilter = () => {
    return activeTab === 'research' ? researchDateFilter : reportsDateFilter;
  };

  const setCurrentDateFilter = (filter: string) => {
    if (activeTab === 'research') {
      setResearchDateFilter(filter);
    } else {
      setReportsDateFilter(filter);
    }
  };

  const getDateFilterLabel = (filter: string) => {
    const options:any = {
      'all': 'All Time',
      'today': 'Today',
      'week': 'This Week',
      'month': 'This Month',
      '3months': 'Last 3 Months',
      '6months': 'Last 6 Months',
      'year': 'This Year'
    };
    return options[filter] || 'All Time';
  };

  const renderHeader = () => (
    <SafeAreaView style={styles.safeAreaHeader}>
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Research Hub</Text>
            <Text style={styles.headerSubtitle}>
              {activeTab === 'research' ? filteredData.length : filteredReports.length} {activeTab === 'research' ? (filteredData.length === 1 ? 'article' : 'articles') : (filteredReports.length === 1 ? 'report' : 'reports')} available
            </Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.profileGradient}
            >
              <Icon name="person-circle-outline" size={32} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Date Filter */}
        <TouchableOpacity 
          style={styles.dateFilterButton}
          onPress={() => setShowDateFilter(true)}
        >
          <Icon name="calendar-outline" size={18} color="#fff" />
          <Text style={styles.dateFilterText}>
            {getDateFilterLabel(getCurrentDateFilter())}
          </Text>
          <Icon name="chevron-down-outline" size={18} color="#fff" />
        </TouchableOpacity>

        {/* Top tabs */}
        <View style={styles.topTabsContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab('research')}
            style={[
              styles.topTabButton,
              activeTab === 'research' && styles.activeTopTab,
            ]}
          >
            <Icon 
              name="document-text-outline" 
              size={18} 
              color={activeTab === 'research' ? '#fff' : '#ccc'} 
            />
            <Text style={[
              styles.topTabText,
              activeTab === 'research' && styles.activeTopTabText,
            ]}>Research</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('reports')}
            style={[
              styles.topTabButton,
              activeTab === 'reports' && styles.activeTopTab,
            ]}
          >
            <Icon 
              name="bar-chart-outline" 
              size={18} 
              color={activeTab === 'reports' ? '#fff' : '#ccc'} 
            />
            <Text style={[
              styles.topTabText,
              activeTab === 'reports' && styles.activeTopTabText,
            ]}>Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  if (loading) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
          {renderHeader()}
          <FlatList
            data={[1, 2, 3, 4, 5]}
            keyExtractor={i => i.toString()}
            renderItem={() => (
              <View style={styles.skeletonCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                  style={styles.skeletonGradient}
                >
                  <View style={styles.skeletonHeader} />
                  <View style={styles.skeletonTitle} />
                  <View style={styles.skeletonText} />
                  <View style={styles.skeletonText} />
                </LinearGradient>
              </View>
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={{ flex: 1,paddingBottom:20 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
        {renderHeader()}

        <DateFilterModal
          visible={showDateFilter}
          onClose={() => setShowDateFilter(false)}
          onApply={setCurrentDateFilter}
          currentFilter={getCurrentDateFilter()}
        />

        {error ? (
          <View style={styles.emptyContainer}>
            <Icon name="warning-outline" size={80} color="#ff6b6b" />
            <Text style={styles.emptyTitle}>Oops!</Text>
            <Text style={styles.emptySubtitle}>{error}</Text>
            <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.retryGradient}
              >
                <Text style={styles.retryText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          activeTab === 'research' ? (
            <FlatList
              data={filteredData}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item, index }) => <ResearchCard item={item} index={index} />}
              contentContainerStyle={styles.list}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#667eea']}
                  tintColor="#667eea"
                />
              }
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Icon name="document-text-outline" size={80} color="#6b7280" />
                  <Text style={styles.emptyTitle}>No Research Found</Text>
                  <Text style={styles.emptySubtitle}>
                    Try adjusting your search or date filter
                  </Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <FlatList
              data={filteredReports}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => <ResearchReportCard report={item} index={index} />}
              contentContainerStyle={styles.list}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#667eea']}
                  tintColor="#667eea"
                />
              }
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Icon name="bar-chart-outline" size={80} color="#6b7280" />
                  <Text style={styles.emptyTitle}>No Reports Found</Text>
                  <Text style={styles.emptySubtitle}>
                    Try adjusting your date filter
                  </Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          )
        )}

        <TouchableOpacity style={styles.fab} onPress={onRefresh}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.fabGradient}
          >
            <Icon name="refresh" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  safeAreaHeader: { backgroundColor: 'transparent' },
  headerContent: { paddingHorizontal: 20 },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: '#fff',
    letterSpacing: -0.5
  },
  headerSubtitle: { 
    fontSize: 15, 
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4
  },
  profileButton: { padding: 8 },
  profileGradient: {
    borderRadius: 20,
    padding: 4
  },
  searchInputContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#fff',
    fontWeight: '500'
  },
  clearButton: { padding: 8 },
  dateFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  dateFilterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 8,
    flex: 1,
  },
  topTabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 4,
  },
  topTabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTopTab: {
    backgroundColor: 'rgba(102, 126, 234, 0.8)',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  topTabText: {
    color: '#ccc',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  activeTopTabText: {
    color: '#fff',
    fontWeight: '700',
  },
  list: { padding: 20 },
  cardContainer: { marginBottom: 20 },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16
  },
  cardGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 16 
  },
  avatarContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  avatarText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '800'
  },
  headerInfo: { flex: 1 },
  title: { 
    fontSize: 19, 
    fontWeight: '700', 
    color: '#fff', 
    marginBottom: 8, 
    lineHeight: 26,
    letterSpacing: -0.3
  },
  metaContainer: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  author: { 
    fontSize: 14, 
    color: '#9ca3af', 
    fontWeight: '600',
    marginLeft: 4
  },
  metaDot: { 
    width: 3, 
    height: 3, 
    borderRadius: 1.5, 
    backgroundColor: '#6b7280', 
    marginHorizontal: 8 
  },
  timestamp: { 
    fontSize: 13, 
    color: '#9ca3af',
    marginLeft: 4
  },
  bookmarkButton: { 
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  message: { 
    fontSize: 15, 
    color: '#e5e7eb', 
    lineHeight: 24, 
    marginBottom: 20,
    fontWeight: '400'
  },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  disclosureButton: {
    flex: 1,
    marginRight: 12,
  },
  tagGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tagText: { 
    fontSize: 13, 
    color: '#fff', 
    fontWeight: '600',
    marginLeft: 6
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  
  // Report Card Styles
  reportCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16
  },
  reportCardGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  reportIconContainer: {
    marginRight: 12,
  },
  reportIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportHeaderInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 24,
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reportDateTime: {
    color: '#9ca3af',
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  reportAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportAuthor: {
    fontSize: 13,
    color: '#9ca3af',
    marginLeft: 6,
    fontWeight: '500',
  },
  downloadButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  stockPicksSection: {
    marginTop: 8,
  },
  stockPicksTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 16,
  },
  stockPickContainer: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stockName: {
    fontWeight: '700',
    color: '#e5e7eb',
    fontSize: 16,
  },
  cmpContainer: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cmpLabel: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  cmpValue: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  stockCommentary: {
    color: '#d1d5db',
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  stockLevels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  levelItem: {
    width: '48%',
    marginBottom: 8,
  },
  levelLabel: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  levelValue: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '700',
  },
  levelValueDanger: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '700',
  },
  moreStocksText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  modalBody: {
    paddingHorizontal: 20,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  activeFilterOption: {
    backgroundColor: '#f0f4ff',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  activeFilterOptionText: {
    color: '#667eea',
    fontWeight: '600',
  },
  
  // Loading and Empty States
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 40 
  },
  emptyTitle: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#e5e7eb', 
    marginVertical: 16, 
    textAlign: 'center' 
  },
  emptySubtitle: { 
    fontSize: 16, 
    color: '#9ca3af', 
    textAlign: 'center', 
    marginBottom: 20,
    lineHeight: 22
  },
  retryButton: {
    marginTop: 20,
  },
  retryGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { 
    color: '#fff', 
    fontWeight: '600',
    fontSize: 16
  },
  skeletonCard: { 
    height: 180, 
    borderRadius: 20, 
    marginBottom: 20,
    overflow: 'hidden'
  },
  skeletonGradient: {
    flex: 1,
    padding: 20,
  },
  skeletonHeader: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    marginBottom: 12,
    width: '60%',
  },
  skeletonTitle: {
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginBottom: 12,
    width: '90%',
  },
  skeletonText: {
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 7,
    marginBottom: 8,
    width: '100%',
  },
  
  // FAB
  fab: {
    position: 'absolute',
    bottom: 60,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});