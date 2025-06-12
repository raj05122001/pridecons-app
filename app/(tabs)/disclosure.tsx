import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Linking,
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

interface Section {
  id: string;
  title: string;
  content: string[];
  icon: string;
}

const DisclosurePage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const sections: Section[] = [
    {
      id: 'overview',
      title: 'Overview',
      icon: 'document-text-outline',
      content: [
        'The particulars given in this Disclosure Document have been prepared in accordance with SEBI (Research Analyst) Regulations, 2014.',
        'The purpose of the Document is to provide essential information about the Research and recommendation Services in a manner to assist and enable the prospective client/client in making an informed decision for engaging in Research and recommendation services before investing.',
        'For the purpose of this Disclosure Document, Research Analyst is Ms. APEKSHA BANSAL, of Pride Trading Consultancy Private Limited, (hereinafter referred as "Research Analyst")'
      ]
    },
    {
      id: 'background',
      title: 'History, Present Business & Background',
      icon: 'business-outline',
      content: [
        'Research Analyst is registered with SEBI as Research Analyst with Registration No. INH000010362. The firm got its registration on Oct 21th, 2022 and is engaged in research and recommendation Services.',
        'The focus of Research Analyst is to provide research and recommendations services to the clients. Analyst aligns its interests with those of the client and seeks to provide the best suited services.'
      ]
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: 'receipt-outline',
      content: [
        'Terms and conditions of Research and Recommendation Services are detailed in the terms and condition document. Please refer to the same for details.'
      ]
    },
    {
      id: 'disciplinary',
      title: 'Disciplinary History',
      icon: 'shield-checkmark-outline',
      content: [
        'No penalties / directions have been issued by SEBI under the SEBI Act or Regulations made there under against the Research Analyst relating to Research Analyst services.',
        'There are no pending material litigations or legal proceedings, findings of inspections or investigations for which action has been taken or initiated by any regulatory authority against the Research Analyst or its employees.'
      ]
    },
    {
      id: 'associates',
      title: 'Details of Associates',
      icon: 'people-outline',
      content: [
        'No associates'
      ]
    },
    {
      id: 'disclosures',
      title: 'Research & Recommendations Disclosures',
      icon: 'eye-outline',
      content: [
        'Research Analyst may have financial interest or actual / beneficial ownership in the securities recommended in its personal portfolio. Details of the same may be referred through the disclosures made at the time of advice.',
        'There are no actual or potential conflicts of interest arising from any connection to or association with any issuer of products/ securities, including any material information or facts that might compromise its objectivity or independence in the carrying on of Research Analyst services.',
        'Research Analyst or its employee or its associates have not received any compensation from the subject company in past 12 months.',
        'Research Analyst or its employee or its associates have not managed or co-managed the public offering of Subject Company in past 12 months.',
        'Research Analyst or its employee or its associates have received any compensation for investment banking or merchant banking of brokerage services from the subject company in past 12 months.',
        'Research Analyst or its employee or its associates have not received any compensation for products or services other than above from the subject company in past 12 months.',
        'Research Analyst or its employee or its associates have not received any compensation or other benefits from the Subject Company or 3rd party in connection with the research report/ recommendation.',
        'The subject company was not a client of Research Analyst or its employee or its associates during twelve months preceding the date of distribution of the research report and recommendation services provided.',
        'Research Analysts or its employee or its associates has not served as an officer, director or employee of the subject company.',
        'Research Analysts has not been engaged in market making activity of the subject company.',
        'The analyst may have holding or position in the securities recommended herein.',
        'The analyst has no connection or association of any sort with any issuer of products/ securities recommended herein.',
        'The analyst has no actual or potential conflicts of interest arising from any connection to or association with any issuer of products/ securities, including any material information or facts that might compromise its objectivity or independence in the carrying on of recommendation services.',
        'The analyst has not received any kind of remuneration or consideration form the products/ securities recommended herein.'
      ]
    }
  ];

  const links = [
    { name: 'BSE India', url: 'https://www.bseindia.com' },
    { name: 'NSE India', url: 'https://www.nseindia.com' }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const openLink = async (url: string, name: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open ${name}. Please check your internet connection.`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to open ${name}`);
    }
  };

  const filteredSections = sections.filter(section => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      section.title.toLowerCase().includes(query) ||
      section.content.some(content => content.toLowerCase().includes(query))
    );
  });

  const ExpandableSection: React.FC<{ section: Section; index: number }> = ({ 
    section, 
    index 
  }) => {
    const isExpanded = expandedSections[section.id];
    const animatedValue = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.sectionContainer,
          {
            opacity: animatedValue,
            transform: [
              {
                translateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(section.id)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeaderLeft}>
            <View style={styles.iconContainer}>
              <Icon name={section.icon} size={20} color="#667eea" />
            </View>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#667eea"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.sectionContent}>
            {section.content.map((paragraph, index) => (
              <View key={index} style={styles.paragraphContainer}>
                <View style={styles.bulletPoint} />
                <Text style={styles.paragraph}>{paragraph}</Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.headerSafeArea}>
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerTop}>
                <View>
                  <Text style={styles.headerTitle}>Legal Disclosure</Text>
                  <Text style={styles.headerSubtitle}>
                    SEBI Compliance & Regulatory Information
                  </Text>
                </View>
                <View style={styles.sebiContainer}>
                  <Icon name="shield-checkmark" size={24} color="#fff" />
                  <Text style={styles.sebiText}>SEBI Registered</Text>
                </View>
              </View>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                  <Icon name="search-outline" size={18} color="#666" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search disclosure content..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <Icon name="close-circle" size={18} color="#666" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Registration Info Card */}
          <Animated.View
            style={[
              styles.registrationCard,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['#f8f9ff', '#ffffff']}
              style={styles.registrationGradient}
            >
              <View style={styles.registrationHeader}>
                <Icon name="certificate-outline" size={24} color="#667eea" />
                <Text style={styles.registrationTitle}>Registration Details</Text>
              </View>
              <View style={styles.registrationDetails}>
                <View style={styles.registrationItem}>
                  <Text style={styles.registrationLabel}>Analyst Name:</Text>
                  <Text style={styles.registrationValue}>Ms. APEKSHA BANSAL</Text>
                </View>
                <View style={styles.registrationItem}>
                  <Text style={styles.registrationLabel}>Company:</Text>
                  <Text style={styles.registrationValue}>Pride Trading Consultancy Pvt. Ltd.</Text>
                </View>
                <View style={styles.registrationItem}>
                  <Text style={styles.registrationLabel}>SEBI Registration:</Text>
                  <Text style={styles.registrationValue}>INH000010362</Text>
                </View>
                <View style={styles.registrationItem}>
                  <Text style={styles.registrationLabel}>Registration Date:</Text>
                  <Text style={styles.registrationValue}>October 21, 2022</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Expandable Sections */}
          {filteredSections.length > 0 ? (
            filteredSections.map((section, index) => (
              <ExpandableSection
                key={section.id}
                section={section}
                index={index}
              />
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Icon name="search-outline" size={48} color="#ccc" />
              <Text style={styles.noResultsText}>No results found</Text>
              <Text style={styles.noResultsSubtext}>
                Try adjusting your search terms
              </Text>
            </View>
          )}

          {/* Important Links Section */}
          <Animated.View
            style={[
              styles.linksSection,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.linksSectionHeader}>
              <Icon name="link-outline" size={20} color="#667eea" />
              <Text style={styles.linksSectionTitle}>Important Links</Text>
            </View>
            <Text style={styles.linksDescription}>
              To access the key features of the securities, particularly performance track record:
            </Text>
            {links.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.linkButton}
                onPress={() => openLink(link.url, link.name)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.linkButtonGradient}
                >
                  <Icon name="globe-outline" size={18} color="#fff" />
                  <Text style={styles.linkButtonText}>{link.name}</Text>
                  <Icon name="open-outline" size={16} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              This disclosure is made in compliance with SEBI (Research Analyst) Regulations, 2014
            </Text>
            <Text style={styles.footerDate}>
              Last Updated: {new Date().toLocaleDateString()}
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default DisclosurePage;

const styles = StyleSheet.create({
  headerGradient: {
    paddingBottom: 20,
  },
  headerSafeArea: {
    paddingTop: 10,
  },
  header: {
    paddingHorizontal: 20,
  },
  headerContent: {
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  sebiContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  sebiText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
    marginLeft: 10,
  },

  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },

  registrationCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  registrationGradient: {
    padding: 20,
  },
  registrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  registrationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 10,
  },
  registrationDetails: {
    gap: 12,
  },
  registrationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  registrationLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  registrationValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    marginTop: -1,
  },
  paragraphContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#667eea',
    marginTop: 7,
    marginRight: 12,
  },
  paragraph: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    flex: 1,
  },

  linksSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  linksSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  linksSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 10,
  },
  linksDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  linkButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  linkButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },

  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },

  footer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  footerDate: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
});