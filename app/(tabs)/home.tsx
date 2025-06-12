import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

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

// Animated card for each research item
const ResearchCard: React.FC<{ item: ResearchItem; index: number }> = ({ item, index }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
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
              outputRange: [20, 0],
            }),
          }],
        },
      ]}
    >
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.author
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.metaContainer}>
              <Text style={styles.author}>{item.author}</Text>
              <View style={styles.metaDot} />
              <Text style={styles.timestamp}>{getTimeAgo(item.timestamp)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bookmarkButton}>
            <Icon name="bookmark-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <Text style={styles.message} numberOfLines={3}>
          {item.message}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Research</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Icon name="share-outline" size={18} color="#667eea" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const HomePage: React.FC = () => {
  const [data, setData] = useState<ResearchItem[]>([]);
  const [filteredData, setFilteredData] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchResearchData();
  }, []);

  useEffect(() => {
    // apply search and filter in real time
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
    setFilteredData(filtered);
  }, [data, searchQuery, selectedFilter]);
  
  const fetchResearchData = async () => {
    try {
      setError('');
      const res = await axios.get(
        'http://192.168.30.216:8000/researcher/?skip=0&limit=100'
      );
      setData(res.data || []);
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
    fetchResearchData();
  };

  const renderHeader = () => (
    <SafeAreaView style={styles.safeAreaHeader}>
     <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Research Hub</Text>
              <Text style={styles.headerSubtitle}>
                {data.length} {data.length === 1 ? 'article' : 'articles'} available
              </Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Icon
                name="person-circle-outline"
                size={32}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.searchInputContainer}>
            <Icon
              name="search-outline"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search research articles..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Icon name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>
    </SafeAreaView>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        {renderHeader()}
        <FlatList
          data={[1, 2, 3, 4, 5]}
          keyExtractor={i => i.toString()}
          renderItem={() => <View style={styles.skeletonCard} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#667eea" />
        {renderHeader()}
        {error ? (
          <View style={styles.emptyContainer}>
            <Icon name="warning-outline" size={80} color="#ff6b6b" />
            <Text style={styles.emptyTitle}>Oops!</Text>
            <Text style={styles.emptySubtitle}>{error}</Text>
            <TouchableOpacity onPress={fetchResearchData}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item, index }) => <ResearchCard item={item} index={index} />}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[
                  '#667eea'
                ]}
              />
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Icon name="document-text-outline" size={80} color="#ccc" />
                <Text style={styles.emptyTitle}>No research found</Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => Alert.alert('Add Research')}
        >
          <LinearGradient
            colors={['#ff7b7b', '#ff6b6b']}
            style={styles.fabGradient}
          >
            <Icon name="add" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "linear-gradient(to right, #667eea, #764ba2)" },
  safeAreaHeader: { backgroundColor: 'transparent' },
  headerGradient: { paddingBottom: 20 },
  headerContent: { paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  profileButton: { padding: 5 },
  searchInputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
    shadowRadius: 4, elevation: 3
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  clearButton: { padding: 5 },
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  list: { padding: 20 },
  cardContainer: { marginBottom: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
    borderWidth: 1, borderColor: '#f0f0f0'
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
  avatarContainer: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#667eea', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  headerInfo: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 6, lineHeight: 24 },
  metaContainer: { flexDirection: 'row', alignItems: 'center' },
  author: { fontSize: 14, color: '#667eea', fontWeight: '600' },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#ccc', marginHorizontal: 8 },
  timestamp: { fontSize: 14, color: '#666' },
  bookmarkButton: { padding: 5 },
  message: { fontSize: 15, color: '#444', lineHeight: 22, marginBottom: 15 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagsContainer: { flexDirection: 'row', flex: 1 },
  tag: { backgroundColor: '#f0f4ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  tagText: { fontSize: 12, color: '#667eea', fontWeight: '600' },
  shareButton: { padding: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 24, fontWeight: '700', color: '#333', marginVertical: 20, textAlign: 'center' },
  emptySubtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
  skeletonCard: { height: 150, backgroundColor: '#e0e0e0', borderRadius: 16, marginBottom: 16 },
  retryText: { color: '#667eea', fontWeight: '600', marginTop: 20 },
  fab: { position: 'absolute', bottom: 80, right: 20, width: 56, height: 56, borderRadius: 28, shadowColor: '#ff6b6b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  fabGradient: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' }
});
