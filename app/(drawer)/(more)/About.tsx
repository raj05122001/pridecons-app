import { DrawerIconButton } from '@/components/DrawerButton';
import Logo from '@/components/logo/Logo';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
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
  const scrollY = useRef(new Animated.Value(0)).current;

  const toggleCard = (cardId: number) => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const toggleAbout = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    setShowFullAbout(!showFullAbout);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Dynamic Header */}
      <Animated.View style={[styles.headerOverlay, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={['rgba(26, 26, 46, 0.95)', 'rgba(22, 33, 62, 0.95)']}
          style={styles.headerGradient}
        />
      </Animated.View>

      {/* Main Header */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.mainHeader}
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
      </LinearGradient>

      <Animated.ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
            style={styles.heroCard}
          >
            {/* Decorative Elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            
            {/* Company Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Logo isBlackLogo={true}/>
              </View>
            </View>

            {/* Company Info */}
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>Pride Trading Consultancy</Text>
              <Text style={styles.companyTagline}>Leading Financial Services Provider</Text>
              
              {/* Enhanced Stats */}
              <View style={styles.statsContainer}>
                <StatItem number="7+" label="Years" color="#1a1a2e" />
                <StatItem number="1000+" label="Clients" color="#16213e" />
                <StatItem number="SEBI" label="Registered" color="#0f3460" />
              </View>
            </View>

            {/* About Text */}
            <View style={styles.aboutContainer}>
              <Text style={styles.aboutText} numberOfLines={showFullAbout ? undefined : 4}>
                <Text style={styles.highlight}>Pride Trading Consultancy Pvt. Ltd.</Text> is a leading Financial Services provider committed to making fair, holistic and top quality financial recommendations accessible to all traders and investors. We are one of the few organizations providing research and information on Indian capital markets based on Technical Analysis and enjoy a strong reputation amongst investors, brokers and researchers. Our team is highly skilled with experienced analysts. Our efforts are to provide you more & more profit in every trade. We have been working in this industry for the last 7 years and Ms. Apeksha Bansal is the founder of this Company and is a SEBI Registered Research Analyst.
              </Text>
              <Pressable onPress={toggleAbout} style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>
                  {showFullAbout ? 'Show Less' : 'Read More'}
                </Text>
                <Icon 
                  name={showFullAbout ? 'chevron-up' : 'chevron-down'} 
                  size={16} 
                  color="#1a1a2e" 
                />
              </Pressable>
            </View>
          </LinearGradient>
        </View>

        {/* Vision Mission Goals */}
        <View style={styles.vmgSection}>
          <Text style={styles.sectionTitle}>Our Foundation</Text>
          <Text style={styles.sectionSubtitle}>Building the future of financial services</Text>
          
          <VisionCard
            id={1}
            number="01"
            title="Vision"
            icon="telescope-outline"
            gradient={['#1a1a2e', '#16213e']}
            text="To become the world's most customer-focused Investment Management company where our customers would be our marketers, our team members would be entrepreneurs & our competition would be our partners."
            expanded={expandedCard === 1}
            onToggle={() => toggleCard(1)}
          />
          
          <VisionCard
            id={2}
            number="02"
            title="Mission"
            icon="rocket-outline"
            gradient={['#16213e', '#0f3460']}
            text="Pride Trading started with a goal of creating wealth for retail and HNI category investors & traders by providing institutional quality research at very reasonable prices. We have successfully achieved this in the past and continue to excel."
            expanded={expandedCard === 2}
            onToggle={() => toggleCard(2)}
          />
          
          <VisionCard
            id={3}
            number="03"
            title="Our Goal"
            icon="flag-outline"
            gradient={['#0f3460', '#1a1a2e']}
            text="We always look forward to new challenges, applying creative solutions and innovative approaches to our ideas, bringing them to market before anyone else. We love what we do and it shows in the quality work we've contributed to the industry for over a decade."
            expanded={expandedCard === 3}
            onToggle={() => toggleCard(3)}
          />
        </View>

        {/* Why Choose Us */}
        <View style={styles.whySection}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          <Text style={styles.sectionSubtitle}>Trusted by thousands of investors</Text>
          
          <View style={styles.whyGrid}>
            <WhyChooseCard
              icon="shield-checkmark-outline"
              title="Professional Excellence"
              description="Fully committed to delivering fair, holistic and top-quality financial recommendations with professional liability coverage."
              gradient={['#1a1a2e', '#16213e']}
            />
            
            <WhyChooseCard
              icon="heart-outline"
              title="Trustworthy Partner"
              description="Fastest growing financial service provider with diligent effort, acknowledged industry leadership and extensive experience."
              gradient={['#16213e', '#0f3460']}
            />
            
            <WhyChooseCard
              icon="pricetag-outline"
              title="Affordable Solutions"
              description="Get premium financial services and research at affordable prices without compromising on quality or reliability."
              gradient={['#0f3460', '#1a1a2e']}
            />

            <WhyChooseCard
              icon="trending-up-outline"
              title="Proven Results"
              description="Track record of consistent performance and successful wealth creation for our diverse client portfolio."
              gradient={['#1a1a2e', '#0f3460']}
            />
          </View>
        </View>

        {/* Team Section */}
        <View style={styles.teamSection}>
          <Text style={styles.sectionTitle}>Leadership</Text>
          <Text style={styles.sectionSubtitle}>Meet our experienced team</Text>
          
          <View style={styles.founderCard}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
              style={styles.founderGradient}
            >
              <View style={styles.founderImageContainer}>
                <LinearGradient
                  colors={['#1a1a2e', '#16213e']}
                  style={styles.founderImage}
                >
                  <Icon name="person" size={36} color="#FFFFFF" />
                </LinearGradient>
              </View>
              
              <View style={styles.founderInfo}>
                <Text style={styles.founderName}>Ms. Apeksha Bansal</Text>
                <Text style={styles.founderTitle}>Founder & CEO</Text>
                <Text style={styles.founderDescription}>SEBI Registered Research Analyst with 7+ years of experience in financial markets</Text>
                
                <View style={styles.founderBadge}>
                  <Icon name="shield-checkmark" size={16} color="#16213e" />
                  <Text style={styles.badgeText}>SEBI Certified</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Enhanced Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>
          <Text style={styles.sectionSubtitle}>Ready to start your investment journey?</Text>
          
          <View style={styles.contactGrid}>
            <ContactCard
              icon="call-outline"
              title="Phone"
              value="+91 XXXXX XXXXX"
              gradient={['#1a1a2e', '#16213e']}
            />
            
            <ContactCard
              icon="mail-outline"
              title="Email"
              value="info@pridecons.com"
              gradient={['#16213e', '#0f3460']}
            />
            
            <ContactCard
              icon="location-outline"
              title="Address"
              value="India"
              gradient={['#0f3460', '#1a1a2e']}
            />
            
            <ContactCard
              icon="globe-outline"
              title="Website"
              value="www.pridecons.com"
              gradient={['#1a1a2e', '#0f3460']}
            />
          </View>

          {/* CTA Button */}
          <Pressable style={styles.ctaButton}>
            <LinearGradient
              colors={['#1a1a2e', '#16213e', '#0f3460']}
              style={styles.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.ctaText}>Start Trading Today</Text>
              <Icon name="arrow-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </View>
  );
}

// Enhanced Stat Item Component
function StatItem({ number, label, color }: { number: string; label: string; color: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statNumber, { color }]}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// Enhanced Vision Card Component
function VisionCard({ id, number, title, icon, gradient, text, expanded, onToggle }: any) {
  return (
    <Pressable style={styles.visionCard} onPress={onToggle}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
        style={styles.visionGradient}
      >
        <View style={styles.visionHeader}>
          <View style={styles.visionLeft}>
            <LinearGradient
              colors={gradient}
              style={styles.visionIcon}
            >
              <Icon name={icon} size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.visionTitleContainer}>
              <Text style={styles.visionNumber}>{number}</Text>
              <Text style={styles.visionTitle}>{title}</Text>
            </View>
          </View>
          <View style={styles.expandIcon}>
            <Icon 
              name={expanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#64748B" 
            />
          </View>
        </View>
        
        {expanded && (
          <View style={styles.visionContent}>
            <Text style={styles.visionText}>{text}</Text>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

// Enhanced Why Choose Card Component
function WhyChooseCard({ icon, title, description, gradient }: any) {
  return (
    <View style={styles.whyCard}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
        style={styles.whyCardGradient}
      >
        <LinearGradient
          colors={gradient}
          style={styles.whyIcon}
        >
          <Icon name={icon} size={28} color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.whyContent}>
          <Text style={styles.whyTitle}>{title}</Text>
          <Text style={styles.whyDescription}>{description}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

// Enhanced Contact Card Component
function ContactCard({ icon, title, value, gradient }: any) {
  return (
    <Pressable style={styles.contactCard}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
        style={styles.contactGradient}
      >
        <LinearGradient
          colors={gradient}
          style={styles.contactIcon}
        >
          <Icon name={icon} size={20} color="#FFFFFF" />
        </LinearGradient>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
  },
  headerGradient: {
    flex: 1,
  },
  mainHeader: {
    paddingBottom: 20,
    zIndex: 11,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  scrollContainer: {
    flex: 1,
  },
  heroSection: {
    margin: 20,
    marginTop: -10,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  heroCard: {
    padding: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(26, 26, 46, 0.08)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(22, 33, 62, 0.08)',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoWrapper: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 46, 0.1)',
  },
  companyInfo: {
    alignItems: 'center',
    marginBottom: 28,
  },
  companyName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  companyTagline: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 46, 0.1)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aboutContainer: {
    marginTop: 12,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#475569',
    textAlign: 'justify',
  },
  highlight: {
    fontWeight: '700',
    color: '#1a1a2e',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(26, 26, 46, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 46, 0.15)',
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    marginRight: 6,
    letterSpacing: 0.3,
  },
  vmgSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  visionCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  visionGradient: {
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 46, 0.1)',
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
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  visionTitleContainer: {
    flex: 1,
  },
  visionNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  visionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.3,
  },
  expandIcon: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
  },
  visionContent: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(100, 116, 139, 0.2)',
  },
  visionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#64748B',
  },
  whySection: {
    padding: 20,
  },
  whyGrid: {
    gap: 16,
  },
  whyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  whyCardGradient: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 46, 0.1)',
  },
  whyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  whyContent: {
    flex: 1,
  },
  whyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  whyDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: '#64748B',
  },
  teamSection: {
    padding: 20,
  },
  founderCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  founderGradient: {
    padding: 28,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 46, 0.1)',
  },
  founderImageContainer: {
    marginRight: 20,
  },
  founderImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  founderInfo: {
    flex: 1,
  },
  founderName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  founderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  founderDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 20,
  },
  founderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 46, 0.15)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16213e',
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  contactSection: {
    padding: 20,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  contactCard: {
    width: (width - 52) / 2,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  contactGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 46, 0.1)',
  },
  contactIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  contactValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#1a1a2e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
    letterSpacing: 0.5,
  },
});