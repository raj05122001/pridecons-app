import { DrawerIconButton } from '@/components/DrawerButton';
import Logo from '@/components/logo/Logo';
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

const { width, height } = Dimensions.get('window');

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AboutPage() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [showFullAbout, setShowFullAbout] = useState(false);

  const toggleCard = (cardId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const toggleAbout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFullAbout(!showFullAbout);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667EEA" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={{flex:1}}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <DrawerIconButton size={24} color="#FFFFFF" />
            <Text style={styles.headerTitle}>About Pride Trading</Text>
            <View style={{ width: 24 }} />
          </View>
        </SafeAreaView>


      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['rgba(102, 126, 234, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.heroGradient}
          >
            {/* Company Logo/Image */}
            <View style={styles.logoContainer}>
               <Logo isBlackLogo={true}/>
            </View>

            {/* Company Info */}
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>Pride Trading Consultancy</Text>
              <Text style={styles.companyTagline}>Leading Financial Services Provider</Text>
              
              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>7+</Text>
                  <Text style={styles.statLabel}>Years</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>1000+</Text>
                  <Text style={styles.statLabel}>Clients</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>SEBI</Text>
                  <Text style={styles.statLabel}>Registered</Text>
                </View>
              </View>
            </View>

            {/* About Text */}
            <View style={styles.aboutContainer}>
              <Text style={styles.aboutText} numberOfLines={showFullAbout ? undefined : 4}>
                <Text style={styles.highlight}>Pride Trading Consultancy Pvt. Ltd.</Text> is a leading Financial Services provider committed to make fair, holistic and top quality financial recommendations accessible to all traders and investors. It is one of the few organizations providing research and information on Indian capital markets mainly based on Technical Analysis and enjoys a strong reputation amongst investors, brokers and researchers. Our team is highly skilled with experienced analysis. Our efforts are to provide you more & more profit in every trade. We are working in this industry for the last 7 years and Ms. Apeksha Bansal is founder of this Company and is a SEBI Registered Research Analyst.
              </Text>
              <TouchableOpacity onPress={toggleAbout} style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>
                  {showFullAbout ? 'Read Less' : 'Read More'}
                </Text>
                <Icon 
                  name={showFullAbout ? 'chevron-up' : 'chevron-down'} 
                  size={16} 
                  color="#667EEA" 
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Vision Mission Goals */}
        <View style={styles.vmgSection}>
          <Text style={styles.sectionTitle}>Our Foundation</Text>
          
          <VisionCard
            id={1}
            number="01"
            title="Vision"
            icon="telescope"
            color="#667EEA"
            text="The World most customer focused Investment Management company where our Customers would be our marketers, our team members would be entrepreneurs & our competition would be our partners."
            expanded={expandedCard === 1}
            onToggle={() => toggleCard(1)}
          />
          
          <VisionCard
            id={2}
            number="02"
            title="Mission"
            icon="rocket"
            color="#10B981"
            text="Pride Trading started with a goal of creating wealth for the retail and HNI category investors & Traders by giving out institutional quality research at a very reasonable price we have successfully done it in the past."
            expanded={expandedCard === 2}
            onToggle={() => toggleCard(2)}
          />
          
          <VisionCard
            id={3}
            number="03"
            title="Our Goal"
            icon="flag"
            color="#F59E0B"
            text="We always look forward to new challenges, applying creative solutions and visuals to our ideas, bringing them to market before anyone. We love what we do and it shows in the work that we have been fortunate enough to contribute to the industry for so over a decade."
            expanded={expandedCard === 3}
            onToggle={() => toggleCard(3)}
          />
        </View>

        {/* Why Choose Us */}
        <View style={styles.whySection}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          
          <WhyChooseCard
            icon="shield-checkmark"
            title="Professional Liability"
            description="Pride Trading is fully committed to make fair, holistic and top quality financial recommendations."
            color="#8B5CF6"
          />
          
          <WhyChooseCard
            icon="heart"
            title="Trustworthy Company"
            description="Pride Trading is the fastest growing financial service with diligent effort, acknowledged industry leadership and experience."
            color="#06B6D4"
          />
          
          <WhyChooseCard
            icon="pricetag"
            title="Affordable Price"
            description="At Pride Trading you will get desired services at affordable price."
            color="#EF4444"
          />
        </View>

        {/* Team Section */}
        <View style={styles.teamSection}>
          <Text style={styles.sectionTitle}>Leadership</Text>
          
          <View style={styles.founderCard}>
            <LinearGradient
              colors={['rgba(102, 126, 234, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.founderGradient}
            >
              <View style={styles.founderImageContainer}>
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  style={styles.founderImage}
                >
                  <Icon name="person" size={32} color="#FFFFFF" />
                </LinearGradient>
              </View>
              
              <View style={styles.founderInfo}>
                <Text style={styles.founderName}>Ms. Apeksha Bansal</Text>
                <Text style={styles.founderTitle}>Founder & CEO</Text>
                <Text style={styles.founderDescription}>SEBI Registered Research Analyst</Text>
                
                <View style={styles.founderBadge}>
                  <Icon name="shield-checkmark" size={14} color="#10B981" />
                  <Text style={styles.badgeText}>SEBI Certified</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          
          <View style={styles.contactGrid}>
            <ContactCard
              icon="call"
              title="Phone"
              value="+91 XXXXX XXXXX"
              color="#10B981"
            />
            
            <ContactCard
              icon="mail"
              title="Email"
              value="info@pridecons.com"
              color="#667EEA"
            />
            
            <ContactCard
              icon="location"
              title="Address"
              value="India"
              color="#F59E0B"
            />
            
            <ContactCard
              icon="globe"
              title="Website"
              value="www.pridecons.com"
              color="#8B5CF6"
            />
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 32 }} />
      </ScrollView>
            </LinearGradient>
    </View>
  );
}

// Vision Card Component
function VisionCard({ id, number, title, icon, color, text, expanded, onToggle }: any) {
  return (
    <View style={styles.visionCard}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.9}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.visionGradient}
        >
          <View style={styles.visionHeader}>
            <View style={styles.visionLeft}>
              <View style={[styles.visionIcon, { backgroundColor: color }]}>
                <Icon name={icon} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.visionTitleContainer}>
                <Text style={styles.visionNumber}>{number}</Text>
                <Text style={styles.visionTitle}>{title}</Text>
              </View>
            </View>
            <Icon 
              name={expanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#64748B" 
            />
          </View>
          
          {expanded && (
            <View style={styles.visionContent}>
              <Text style={styles.visionText}>{text}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

// Why Choose Card Component
function WhyChooseCard({ icon, title, description, color }: any) {
  return (
    <View style={styles.whyCard}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.whyCardGradient}
      >
        <View style={[styles.whyIcon, { backgroundColor: `${color}15` }]}>
          <Icon name={icon} size={28} color={color} />
        </View>
        <View style={styles.whyContent}>
          <Text style={styles.whyTitle}>{title}</Text>
          <Text style={styles.whyDescription}>{description}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

// Contact Card Component
function ContactCard({ icon, title, value, color }: any) {
  return (
    <View style={styles.contactCard}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.contactGradient}
      >
        <View style={[styles.contactIcon, { backgroundColor: color }]}>
          <Icon name={icon} size={20} color="#FFFFFF" />
        </View>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  heroSection: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  heroGradient: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  companyInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  companyName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  companyTagline: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#667EEA',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    marginHorizontal: 16,
  },
  aboutContainer: {
    marginTop: 8,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
    textAlign: 'justify',
  },
  highlight: {
    fontWeight: '700',
    color: '#667EEA',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667EEA',
    marginRight: 4,
  },
  vmgSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  visionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  visionGradient: {
    padding: 20,
  },
  visionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  visionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  visionTitleContainer: {
    flex: 1,
  },
  visionNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 2,
  },
  visionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  visionContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  visionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
  },
  whySection: {
    padding: 16,
  },
  whyCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  whyCardGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  whyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  whyContent: {
    flex: 1,
  },
  whyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  whyDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
  },
  teamSection: {
    padding: 16,
  },
  founderCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  founderGradient: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  founderImageContainer: {
    marginRight: 20,
  },
  founderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  founderInfo: {
    flex: 1,
  },
  founderName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  founderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667EEA',
    marginBottom: 8,
  },
  founderDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  founderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 4,
  },
  contactSection: {
    padding: 16,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contactCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactGradient: {
    padding: 20,
    alignItems: 'center',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E293B',
    textAlign: 'center',
  },
});