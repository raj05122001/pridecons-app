// src/screens/IpoPage.tsx
import { DrawerIconButton } from '@/components/DrawerButton';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
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

const { width, height } = Dimensions.get('window');

export const ipoDetailFilter = [
  { name: "Top Performers", value: "most-successful", icon: "trending-up" },
  { name: "Underperformers", value: "least-successful", icon: "trending-down" },
  { name: "Recently Listed", value: "recently-listed", icon: "time" },
  { name: "IPOs 2025", value: "2025", icon: "calendar" },
  { name: "IPOs 2024", value: "2024", icon: "calendar-outline" },
  { name: "IPOs 2023", value: "2023", icon: "calendar-outline" },
  { name: "IPOs 2022", value: "2022", icon: "calendar-outline" },
  { name: "IPOs 2021", value: "2021", icon: "calendar-outline" },
  { name: "IPOs 2020", value: "2020", icon: "calendar-outline" },
  { name: "Upcoming", value: "upcoming", icon: "rocket" },
];

type IpoItem = any;

export default function IpoPage() {
  const [filterType, setFilterType] = useState("most-successful");
  const [ipoData, setIpoData] = useState<IpoItem[]>([]);
  const [drhpData, setDrhpData] = useState<IpoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchIpoData();
  }, [filterType]);

  const fetchIpoData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const res = await axios.get(`https://pridecons.sbs/ipo?key=${filterType}`);
      const d = res.data.data;
      if (filterType === "upcoming") {
        setDrhpData(d.draft_issues || []);
        setIpoData(d.upcoming_open || []);
      } else {
        setIpoData(d);
        setDrhpData([]);
      }
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchIpoData(true);
  };

  const paginatedData = ipoData.slice(
    (currentPage-1)*itemsPerPage,
    currentPage*itemsPerPage
  );
  const totalPages = Math.ceil(ipoData.length / itemsPerPage);

  const getPerformanceColor = (current: string, issue: string) => {
    const currentPrice = parseFloat(current);
    const issuePrice = parseFloat(issue.toString().replace("₹",""));
    if (currentPrice > issuePrice) return '#10B981'; // Green
    if (currentPrice < issuePrice) return '#EF4444'; // Red
    return '#6B7280'; // Gray
  };

  const getPerformanceIcon = (current: string, issue: string) => {
    const currentPrice = parseFloat(current);
    const issuePrice = parseFloat(issue.toString().replace("₹",""));
    if (currentPrice > issuePrice) return 'trending-up';
    if (currentPrice < issuePrice) return 'trending-down';
    return 'remove';
  };

  const FilterButton = ({ filter, isActive, onPress }: any) => (
    <TouchableOpacity
      style={[styles.filterChip, isActive && styles.filterChipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Icon 
        name={filter.icon} 
        size={16} 
        color={isActive ? '#FFFFFF' : '#94A3B8'} 
        style={styles.filterIcon}
      />
      <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
        {filter.name}
      </Text>
    </TouchableOpacity>
  );

  const IpoCard = ({ item }: { item: IpoItem }) => {
    const performanceColor = getPerformanceColor(
      item.listing_close_price || item.current_price, 
      item.issue_price
    );
    const performanceIcon = getPerformanceIcon(
      item.listing_close_price || item.current_price, 
      item.issue_price
    );

    return (
      <View style={styles.ipoCard}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.cardGradient}
        >
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>
                {item.company_name || item.companyName}
              </Text>
              <Text style={styles.listingDate}>
                Listed: {item.listing_date}
              </Text>
            </View>
            <View style={[styles.performanceIndicator, { backgroundColor: performanceColor }]}>
              <Icon name={performanceIcon} size={16} color="#FFFFFF" />
            </View>
          </View>

          {/* Main Info */}
          <View style={styles.cardBody}>
            <View style={styles.priceSection}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Current Price</Text>
                <Text style={[styles.priceValue, { color: performanceColor }]}>
                  {item.current_price}
                </Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Issue Price</Text>
                <Text style={styles.priceValue}>{item.issue_price}</Text>
              </View>
            </View>

            <View style={styles.statsSection}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Market Cap</Text>
                <Text style={styles.statValue}>{item.mcap_q}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Issue Size</Text>
                <Text style={styles.statValue}>{item.issue_size}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Subscription</Text>
                <Text style={styles.statValue}>{item.total_subscription}</Text>
              </View>
            </View>
          </View>

          {/* Subscription Details */}
          <View style={styles.subscriptionSection}>
            <View style={styles.subscriptionItem}>
              <Text style={styles.subscriptionLabel}>QIB</Text>
              <Text style={styles.subscriptionValue}>{item.qib || "N/A"}</Text>
            </View>
            <View style={styles.subscriptionItem}>
              <Text style={styles.subscriptionLabel}>HNI</Text>
              <Text style={styles.subscriptionValue}>{item.hni || "N/A"}</Text>
            </View>
            <View style={styles.subscriptionItem}>
              <Text style={styles.subscriptionLabel}>Retail</Text>
              <Text style={styles.subscriptionValue}>{item.retail}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const UpcomingIpoCard = ({ item }: { item: IpoItem }) => (
    <View style={styles.upcomingCard}>
      <LinearGradient
        colors={['rgba(102, 126, 234, 0.15)', 'rgba(102, 126, 234, 0.05)']}
        style={styles.cardGradient}
      >
        <View style={styles.upcomingHeader}>
          <Text style={styles.companyName}>{item.companyName}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.subscriptionStatus?.trim() || "Upcoming"}</Text>
          </View>
        </View>

        <View style={styles.upcomingBody}>
          <View style={styles.upcomingRow}>
            <Text style={styles.upcomingLabel}>Issue Size</Text>
            <Text style={styles.upcomingValue}>₹{(item.issueSize/1e7).toFixed(2)} Cr</Text>
          </View>
          <View style={styles.upcomingRow}>
            <Text style={styles.upcomingLabel}>Price Band</Text>
            <Text style={styles.upcomingValue}>₹{item.priceMin} - ₹{item.priceMax}</Text>
          </View>
          <View style={styles.upcomingRow}>
            <Text style={styles.upcomingLabel}>Bid Period</Text>
            <Text style={styles.upcomingValue}>{item.startDate} - {item.endDate}</Text>
          </View>
          <View style={styles.upcomingRow}>
            <Text style={styles.upcomingLabel}>Lot Size</Text>
            <Text style={styles.upcomingValue}>{item.lotSize}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.documentButton}>
          <Icon name="document-text" size={16} color="#667EEA" />
          <Text style={styles.documentText}>View IPO Document</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="document-text-outline" size={64} color="#475569" />
      <Text style={styles.emptyTitle}>No IPO Data Found</Text>
      <Text style={styles.emptySubtitle}>Try selecting a different filter or refresh the data</Text>
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Icon name="refresh" size={20} color="#667EEA" />
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  const PaginationButton = ({ page, isActive, onPress }: any) => (
    <TouchableOpacity
      style={[styles.pageButton, isActive && styles.pageButtonActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.pageText, isActive && styles.pageTextActive]}>
        {page}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        
        {/* Header */}
        <View style={styles.header}>
          <DrawerIconButton size={24} color="#FFFFFF" />
          <Text style={styles.headerTitle}>IPO Analytics</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshIconButton}>
            <Icon name="refresh" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Filter Bar */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {ipoDetailFilter.map(filter => (
              <FilterButton
                key={filter.value}
                filter={filter}
                isActive={filterType === filter.value}
                onPress={() => {
                  setFilterType(filter.value);
                  setCurrentPage(1);
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667EEA" />
            <Text style={styles.loadingText}>Loading IPO data...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.content}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#667EEA"
                colors={['#667EEA']}
              />
            }
          >
            {filterType === 'upcoming' ? (
              <>
                {/* Upcoming IPOs */}
                {ipoData.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Icon name="rocket" size={20} color="#667EEA" />
                      <Text style={styles.sectionTitle}>Live & Upcoming IPOs</Text>
                    </View>
                    {ipoData.map((item, index) => (
                      <UpcomingIpoCard key={index} item={item} />
                    ))}
                  </View>
                )}

                {/* DRHPs */}
                {drhpData.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Icon name="document" size={20} color="#667EEA" />
                      <Text style={styles.sectionTitle}>Draft Red Herring Prospectus</Text>
                    </View>
                    {drhpData.map((item, index) => (
                      <View key={index} style={styles.drhpCard}>
                        <LinearGradient
                          colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
                          style={styles.cardGradient}
                        >
                          <Text style={styles.companyName}>{item.companyName}</Text>
                          <View style={styles.drhpInfo}>
                            <Text style={styles.drhpLabel}>Issue Size: {item.issueSize}</Text>
                            <Text style={styles.drhpLabel}>Filing Date: {item.drhpFilingDate}</Text>
                          </View>
                          <TouchableOpacity style={styles.documentButton}>
                            <Icon name="download" size={16} color="#667EEA" />
                            <Text style={styles.documentText}>Download DRHP</Text>
                          </TouchableOpacity>
                        </LinearGradient>
                      </View>
                    ))}
                  </View>
                )}
              </>
            ) : (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Icon name="analytics" size={20} color="#667EEA" />
                  <Text style={styles.sectionTitle}>
                    {ipoDetailFilter.find(f => f.value === filterType)?.name}
                  </Text>
                  <Text style={styles.countBadge}>{ipoData.length}</Text>
                </View>

                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <IpoCard key={index} item={item} />
                  ))
                ) : (
                  <EmptyState />
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <View style={styles.paginationContainer}>
                    <View style={styles.pagination}>
                      {currentPage > 1 && (
                        <TouchableOpacity
                          style={styles.paginationArrow}
                          onPress={() => setCurrentPage(currentPage - 1)}
                        >
                          <Icon name="chevron-back" size={20} color="#667EEA" />
                        </TouchableOpacity>
                      )}
                      
                      {Array.from({length: Math.min(totalPages, 5)}, (_, i) => {
                        let page;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                        
                        return (
                          <PaginationButton
                            key={page}
                            page={page}
                            isActive={currentPage === page}
                            onPress={() => setCurrentPage(page)}
                          />
                        );
                      })}
                      
                      {currentPage < totalPages && (
                        <TouchableOpacity
                          style={styles.paginationArrow}
                          onPress={() => setCurrentPage(currentPage + 1)}
                        >
                          <Icon name="chevron-forward" size={20} color="#667EEA" />
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    <Text style={styles.paginationInfo}>
                      Page {currentPage} of {totalPages} • {ipoData.length} total results
                    </Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        )}
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
  filterContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 12,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  filterChipActive: {
    backgroundColor: '#667EEA',
    borderColor: '#667EEA',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
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
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
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
  ipoCard: {
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
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  listingDate: {
    fontSize: 14,
    color: '#94A3B8',
  },
  performanceIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    marginBottom: 16,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceItem: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subscriptionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  subscriptionItem: {
    alignItems: 'center',
  },
  subscriptionLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  subscriptionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  upcomingCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: '#667EEA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  upcomingBody: {
    marginBottom: 16,
  },
  upcomingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  upcomingLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  upcomingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderWidth: 1,
    borderColor: '#667EEA',
  },
  documentText: {
    marginLeft: 8,
    color: '#667EEA',
    fontWeight: '600',
  },
  drhpCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  drhpInfo: {
    marginBottom: 12,
  },
  drhpLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
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
  refreshText: {
    marginLeft: 8,
    color: '#667EEA',
    fontWeight: '600',
  },
  paginationContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paginationArrow: {
    padding: 8,
    marginHorizontal: 4,
  },
  pageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  pageButtonActive: {
    backgroundColor: '#667EEA',
    borderColor: '#667EEA',
  },
  pageText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  pageTextActive: {
    color: '#FFFFFF',
  },
  paginationInfo: {
    fontSize: 12,
    color: '#94A3B8',
  },
});