import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

interface NewsItem {
  id: string;
  title: string;
  source?: { title: string };
  dateTime: string;
  image?: string;
  body?: string;
}

// Separate component for news card with animations
const NewsCard: React.FC<{ item: NewsItem; index: number; onPress: () => void }> = ({ 
  item, 
  index, 
  onPress 
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const formatTimeAgo = (dateTime: string) => {
    const date = new Date(dateTime);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
            { scale: scaleValue },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.cardContent}>
          {item.image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.thumbnail} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)']}
                style={styles.imageOverlay}
              />
            </View>
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="newspaper-outline" size={24} color="#666" />
            </View>
          )}
          
          <View style={styles.cardText}>
            <View style={styles.sourceContainer}>
              <View style={styles.sourceBadge}>
                <Text style={styles.sourceText}>
                  {item.source?.title || 'Unknown'}
                </Text>
              </View>
              <View style={styles.liveBadge}>
                <View style={styles.liveIndicator} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            
            <Text style={styles.title} numberOfLines={3}>
              {item.title}
            </Text>
            
            <View style={styles.metaRow}>
              <Icon name="time-outline" size={14} color="#888" />
              <Text style={styles.metaText}>
                {formatTimeAgo(item.dateTime)}
              </Text>
              <View style={styles.metaDivider} />
              <Icon name="eye-outline" size={14} color="#888" />
              <Text style={styles.metaText}>
                {Math.floor(Math.random() * 1000 + 100)}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.bookmarkButton}>
            <Icon name="bookmark-outline" size={20} color="#667eea" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Skeleton loading component
const SkeletonCard: React.FC = () => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.skeletonCard}>
      <Animated.View
        style={[
          styles.skeletonThumbnail,
          {
            opacity: shimmerValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.7],
            }),
          },
        ]}
      />
      <View style={styles.skeletonContent}>
        <Animated.View
          style={[
            styles.skeletonTitle,
            {
              opacity: shimmerValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.7],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonMeta,
            {
              opacity: shimmerValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.7],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

export default function NewsPage() {
  const [data, setData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [error, setError] = useState<string>('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    fetchNews();
    // Header animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchNews = async () => {
    try {
      setError('');
      const res = await axios.get<NewsItem[]>('https://pridecons.sbs/news/home');
      setData(res.data || []);
    } catch (e) {
      console.error(e);
      setError('Failed to load news. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  // Enhanced filter with better search
  const filtered = data.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    
    return (
      item.title.toLowerCase().includes(q) ||
      (item.source?.title.toLowerCase().includes(q)) ||
      (item.body?.toLowerCase().includes(q))
    );
  });

  const renderSkeletonList = () => (
    <FlatList
      data={[1, 2, 3, 4, 5]}
      keyExtractor={(item) => item.toString()}
      renderItem={() => <SkeletonCard />}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon 
        name={searchQuery ? "search-outline" : "newspaper-outline"} 
        size={80} 
        color="#444" 
      />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No results found' : 'No news available'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Try adjusting your search terms' 
          : 'Check back later for the latest updates'
        }
      </Text>
      {searchQuery && (
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={() => setSearchQuery('')}
        >
          <Text style={styles.clearSearchText}>Clear Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="warning-outline" size={80} color="#ff6b6b" />
      <Text style={styles.emptyTitle}>Something went wrong</Text>
      <Text style={styles.emptySubtitle}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => {
          setLoading(true);
          fetchNews();
        }}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.retryButtonGradient}
        >
          <Icon name="refresh" size={20} color="#fff" />
          <Text style={styles.retryButtonText}>Try Again</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item, index }: { item: NewsItem; index: number }) => (
    <NewsCard 
      item={item} 
      index={index} 
      onPress={() => setSelected(item)} 
    />
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safe}>
          {/* HEADER */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerTitle}>News Hub</Text>
                <Text style={styles.headerSubtitle}>
                  Stay updated with latest market news
                </Text>
              </View>
              <View style={styles.coinBox}>
                <Icon name="diamond" size={18} color="#F5A623" />
                <Text style={styles.coinText}>200</Text>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <Icon name="search" size={18} color="#888" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search news, sources..."
                  placeholderTextColor="#888"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Icon name="close-circle" size={18} color="#888" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* SECTION TITLE */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {searchQuery ? `Results for "${searchQuery}"` : 'Breaking News'}
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.seeAll}>See all ›</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* NEWS LIST */}
          {loading ? (
            renderSkeletonList()
          ) : error ? (
            renderErrorState()
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={[
                styles.listContainer,
                filtered.length === 0 && styles.emptyList
              ]}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#667eea']}
                  tintColor="#667eea"
                />
              }
              ListEmptyComponent={!loading && !error ? renderEmptyState : null}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}

          {/* ENHANCED MODAL */}
          <Modal
            visible={!!selected}
            transparent
            animationType="slide"
            onRequestClose={() => setSelected(null)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <TouchableOpacity 
                  style={styles.modalClose} 
                  onPress={() => setSelected(null)}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
                    style={styles.modalCloseGradient}
                  >
                    <Icon name="close" size={24} color="#333" />
                  </LinearGradient>
                </TouchableOpacity>

                <ScrollView 
                  style={styles.modalContent}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {selected?.image && (
                    <View style={styles.modalImageContainer}>
                      <Image 
                        source={{ uri: selected.image }} 
                        style={styles.modalImage}
                        resizeMode="cover"
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.3)']}
                        style={styles.modalImageOverlay}
                      />
                    </View>
                  )}

                  <View style={styles.modalTextContent}>
                    <View style={styles.modalHeader}>
                      <View style={styles.modalSourceBadge}>
                        <Text style={styles.modalSourceText}>
                          {selected?.source?.title || 'Unknown Source'}
                        </Text>
                      </View>
                      <Text style={styles.modalDate}>{selected?.dateTime}</Text>
                    </View>

                    <Text style={styles.modalTitle}>{selected?.title}</Text>
                    
                    <View style={styles.modalActions}>
                      <TouchableOpacity style={styles.modalAction}>
                        <Icon name="bookmark-outline" size={20} color="#667eea" />
                        <Text style={styles.modalActionText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalAction}>
                        <Icon name="share-outline" size={20} color="#667eea" />
                        <Text style={styles.modalActionText}>Share</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalAction}>
                        <Icon name="open-outline" size={20} color="#667eea" />
                        <Text style={styles.modalActionText}>Open</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.modalBody}>
                      {selected?.body || 'Full article content would appear here...'}
                    </Text>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Floating refresh button */}
          <TouchableOpacity
            style={styles.fab}
            onPress={onRefresh}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.fabGradient}
            >
              <Icon name="refresh" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:20
  },
  safe: { 
    flex: 1,
  },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#FFF',
    fontSize: 16,
    paddingVertical: 0,
  },
  coinBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 166, 35, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 166, 35, 0.3)',
  },
  coinText: {
    color: '#F5A623',
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  seeAll: {
    color: '#F5A623',
    fontSize: 14,
    fontWeight: '600',
  },

  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  emptyList: {
    flex: 1,
  },
  separator: {
    height: 12,
  },

  cardContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: 90,
    height: 120,
    borderRadius: 12,
    objectFit:"fill"
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  placeholderImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'space-between',
  },
  sourceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceBadge: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sourceText: {
    color: '#667eea',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff6b6b',
    marginRight: 4,
  },
  liveText: {
    color: '#ff6b6b',
    fontSize: 9,
    fontWeight: '700',
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#888',
    marginLeft: 4,
    fontSize: 12,
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#666',
    marginHorizontal: 8,
  },
  bookmarkButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },

  // Skeleton styles
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  skeletonThumbnail: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  skeletonContent: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  skeletonTitle: {
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonMeta: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    width: '60%',
  },

  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  clearSearchButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderRadius: 20,
  },
  clearSearchText: {
    color: '#667eea',
    fontWeight: '600',
  },
  retryButton: {
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },

  // Enhanced Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    overflow: 'hidden',
  },
  modalClose: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalCloseGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
  },
  modalImageContainer: {
    position: 'relative',
  },
  modalImage: {
    width: width,
    height: width * 0.6,
  },
  modalImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  modalTextContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalSourceBadge: {
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalSourceText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  modalDate: {
    fontSize: 12,
    color: '#666',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    lineHeight: 32,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 20,
  },
  modalAction: {
    alignItems: 'center',
  },
  modalActionText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  modalBody: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 60,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});