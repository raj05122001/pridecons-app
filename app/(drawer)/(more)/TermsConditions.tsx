import { DrawerIconButton } from '@/components/DrawerButton';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  LayoutAnimation,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TermsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const terms = [
    {
      id: 'general',
      title: 'General Information',
      icon: 'information-circle',
      color: '#3B82F6',
      content: 'The content of the pages of this website is for your general information and use only. It is subject to change without notice.'
    },
    {
      id: 'liability',
      title: 'Liability Disclaimer',
      icon: 'shield-checkmark',
      color: '#10B981',
      content: 'Pride Trading Consultancy Pvt. Ltd shall not be liable for any misrepresentation, falsification, and deception or for any lack of availability of services through the Web site, even if the same are advertised for on the Web site.'
    },
    {
      id: 'accuracy',
      title: 'Content Accuracy',
      icon: 'checkmark-circle',
      color: '#8B5CF6',
      content: 'No judgment or warranty or representation is made with respect to the accuracy, timeliness, or suitability of the content of other services or sites Pride Trading Consultancy Pvt. Ltd shall not be responsible therefore.'
    },
    {
      id: 'ethics',
      title: 'Business Ethics',
      icon: 'heart',
      color: '#06B6D4',
      content: 'We strictly follow the ethical business policies while growing our business.'
    },
    {
      id: 'downloads',
      title: 'Downloads & Distribution',
      icon: 'download',
      color: '#F59E0B',
      content: 'Pride Trading Consultancy Pvt. Ltd shall not be liable if the Customer downloads any information from this Web site. Further, Pride Trading Consultancy Pvt. Ltd shall not be liable if the Customer makes a copy, modifies, uploads, downloads, other notices or legends contained in any such information or otherwise distributes any service or content from this Web site.'
    },
    {
      id: 'service-changes',
      title: 'Service Modifications',
      icon: 'settings',
      color: '#EF4444',
      content: 'Pride Trading Consultancy Pvt. Ltd reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice at any time. You agree that Pride Trading Consultancy Pvt. Ltd shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.'
    },
    {
      id: 'registration',
      title: 'User Registration',
      icon: 'person-add',
      color: '#84CC16',
      content: 'Registration: In order to use Pride Trading Consultancy Pvt. Ltd, you must provide certain personal information.'
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: 'lock-closed',
      color: '#F97316',
      content: 'Registration Data and certain other information about you are subject to www.pridecons.com please read this policy carefully. The Stock Tips and Commodity Tips, views, blogs, comments etc. made by the users and placed on the Site are their own independent views and Company, its owners, management, shareholders and employees are in no way linked to these users, or have a vested or beneficial interest in any of the user\'s tips etc. These terms and conditions shall be applicable to any person visiting/accessing the Web site.'
    },
    {
      id: 'jurisdiction',
      title: 'Legal Jurisdiction',
      icon: 'business',
      color: '#DC2626',
      content: 'In case of any disputes arising between Pride Trading Consultancy Pvt. Ltd & the client, all the matters shall be subject to Vadodra Jurisdiction, Gujarat only.'
    }
  ];

  const refundPolicyPoints = [
    {
      id: 'no-guarantee',
      title: 'No Guarantee Policy',
      icon: 'warning',
      content: 'We do not offer a 100% guarantee on our calls and hence cannot offer any refund on subscriptions regardless of the individual client\'s performance.'
    },
    {
      id: 'no-cancellation',
      title: 'No Cancellation',  
      icon: 'close-circle',
      content: 'Once a service has been subscribed to and a payment has been made for the same, it can\'t be canceled or refunded in any case.'
    },
    {
      id: 'satisfaction',
      title: 'Client Satisfaction',
      icon: 'happy',
      content: 'If for some unforeseen reason, the client is not satisfied with our services, they may call us to seek direction on future calls.'
    },
    {
      id: 'final-decision',
      title: 'Final Decision',
      icon: 'hammer',
      content: 'Any request by the client to cancel a service or get a refund will NOT be accepted in any case.'
    }
  ];

  const recommendations = [
    'Read all information about our services and support given to our clients.',
    'Read our Terms and Conditions.',
    'Read our Privacy Policy and Refund Policy.',
    'There is no refund possible in any case whatsoever.'
  ];

  const filteredTerms = terms.filter(term =>
    term.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    term.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        
        {/* Header */}
        <View style={styles.header}>
          <DrawerIconButton size={24} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Introduction */}
          <View style={styles.introSection}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.introCard}
            >
              <View style={styles.introIconContainer}>
                <Icon name="document-text" size={32} color="#667EEA" />
              </View>
              <Text style={styles.introTitle}>Legal Agreement</Text>
              <Text style={styles.introText}>
                By using our services, you agree to these terms and conditions. Please read them carefully before proceeding.
              </Text>
            </LinearGradient>
          </View>

          {/* Terms & Conditions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="document-text" size={20} color="#667EEA" />
              <Text style={styles.sectionTitle}>Terms & Conditions</Text>
              <Text style={styles.countBadge}>{filteredTerms.length}</Text>
            </View>

            {filteredTerms.map((term, index) => (
              <TermCard
                key={term.id}
                term={term}
                index={index + 1}
                expanded={expandedSection === term.id}
                onToggle={() => toggleSection(term.id)}
              />
            ))}
          </View>

          {/* Refund Policy Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="card" size={20} color="#EF4444" />
              <Text style={styles.sectionTitle}>Refund Policy</Text>
            </View>

            <View style={styles.policyCard}>
              <LinearGradient
                colors={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']}
                style={styles.policyGradient}
              >
                <View style={styles.policyHeader}>
                  <Icon name="information-circle" size={24} color="#EF4444" />
                  <Text style={styles.policyHeaderText}>Important Notice</Text>
                </View>
                <Text style={styles.policyMainText}>
                  We value our customers and are committed to providing best services. Our clients need to realize that we do not offer a 100% guarantee on our calls and hence cannot offer any refund on subscriptions regardless of the individual client's performance.
                </Text>
              </LinearGradient>
            </View>

            {refundPolicyPoints.map((point, index) => (
              <View key={point.id} style={styles.policyPoint}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                  style={styles.policyPointGradient}
                >
                  <View style={styles.policyPointHeader}>
                    <View style={[styles.policyIcon, { backgroundColor: `#EF444415` }]}>
                      <Icon name={point.icon} size={20} color="#EF4444" />
                    </View>
                    <Text style={styles.policyPointTitle}>{point.title}</Text>
                  </View>
                  <Text style={styles.policyPointContent}>{point.content}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>

          {/* Recommendations Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="bulb" size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Before Making Payment</Text>
            </View>

            <View style={styles.recommendationCard}>
              <LinearGradient
                colors={['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)']}
                style={styles.recommendationGradient}
              >
                <Text style={styles.recommendationText}>
                  We strongly recommend that before making a payment, our visitors and potential clients:
                </Text>
                
                {recommendations.map((recommendation, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <View style={styles.recommendationBullet}>
                      <Icon name="checkmark-circle" size={16} color="#F59E0B" />
                    </View>
                    <Text style={styles.recommendationItemText}>{recommendation}</Text>
                  </View>
                ))}

                <View style={styles.finalNotice}>
                  <Icon name="warning" size={20} color="#EF4444" />
                  <Text style={styles.finalNoticeText}>
                    Kindly make the payment after reading all terms and conditions, disclaimers and refund policy.
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="help-circle" size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Need Help?</Text>
            </View>

            <View style={styles.contactCard}>
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
                style={styles.contactGradient}
              >
                <Text style={styles.contactTitle}>Have Questions?</Text>
                <Text style={styles.contactText}>
                  If you have any questions about these terms and conditions, please contact our support team.
                </Text>
                <View style={styles.contactActions}>
                  <TouchableOpacity style={styles.contactButton}>
                    <Icon name="call" size={18} color="#10B981" />
                    <Text style={styles.contactButtonText}>Call Support</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.contactButton}>
                    <Icon name="mail" size={18} color="#10B981" />
                    <Text style={styles.contactButtonText}>Email Us</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Bottom Padding */}
          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Term Card Component
function TermCard({ term, index, expanded, onToggle }: any) {
  return (
    <View style={styles.termCard}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.9}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.termGradient}
        >
          <View style={styles.termHeader}>
            <View style={styles.termLeft}>
              <View style={[styles.termIcon, { backgroundColor: `${term.color}15` }]}>
                <Icon name={term.icon} size={20} color={term.color} />
              </View>
              <View style={styles.termTitleContainer}>
                <Text style={styles.termNumber}>{index.toString().padStart(2, '0')}</Text>
                <Text style={styles.termTitle}>{term.title}</Text>
              </View>
            </View>
            <Icon 
              name={expanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#64748B" 
            />
          </View>
          
          {expanded && (
            <View style={styles.termContent}>
              <Text style={styles.termText}>{term.content}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
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
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
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
  clearButton: {
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  introSection: {
    padding: 16,
  },
  introCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  introIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
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
  termCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  termGradient: {
    padding: 16,
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  termLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  termIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  termTitleContainer: {
    flex: 1,
  },
  termNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 2,
  },
  termTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  termContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  termText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
  },
  policyCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  policyGradient: {
    padding: 20,
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  policyHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
    marginLeft: 12,
  },
  policyMainText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#64748B',
  },
  policyPoint: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  policyPointGradient: {
    padding: 16,
  },
  policyPointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  policyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  policyPointTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  policyPointContent: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
  },
  recommendationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  recommendationGradient: {
    padding: 20,
  },
  recommendationText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 24,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationBullet: {
    marginRight: 12,
    marginTop: 2,
  },
  recommendationItemText: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  finalNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
  },
  finalNoticeText: {
    flex: 1,
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 12,
    lineHeight: 22,
    fontWeight: '500',
  },
  contactCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  contactGradient: {
    padding: 20,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
});