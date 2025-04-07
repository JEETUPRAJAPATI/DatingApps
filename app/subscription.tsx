import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Check, Video, Clock, Star, Crown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from './_layout';
import NeonText from '../components/NeonText';
import Card from '../components/Card';
import NeonGradient from '../components/NeonGradient';
import GradientButton from '../components/GradientButton';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    duration: 'month',
    features: [
      '5 hours of video calls',
      'Ad-free experience',
      'See who likes you',
      'Unlimited likes',
    ],
    color: theme.neonPink,
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    duration: 'month',
    features: [
      '20 hours of video calls',
      'Priority in search results',
      'See who likes you',
      'Unlimited likes',
      'Rewind to missed matches',
      'Monthly boost',
    ],
    color: theme.neonBlue,
    popular: true,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 29.99,
    duration: 'month',
    features: [
      '100 hours of video calls',
      'Priority in search results',
      'See who likes you',
      'Unlimited likes',
      'Rewind to missed matches',
      'Weekly boost',
      'VIP support',
      'Message before matching',
    ],
    color: theme.neonPurple,
    popular: false,
  }
];

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <NeonText 
          text="Upgrade Plan"
          color={theme.neonPink}
          size={18}
          style={styles.headerTitle}
        />
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.hero}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2574&auto=format&fit=crop' }}
            style={styles.heroImage}
          />
          <View style={styles.heroContent}>
            <Crown size={32} color={theme.neonBlue} />
            <NeonText 
              text="Unlock Premium Features"
              color={theme.neonBlue}
              size={24}
              style={styles.heroTitle}
            />
            <Text style={styles.heroSubtitle}>
              Get more matches and better conversations with premium features
            </Text>
          </View>
        </Card>

        <View style={styles.plans}>
          {PLANS.map((plan, index) => (
            <Animated.View
              key={plan.id}
              entering={FadeInDown.delay(index * 200)}
            >
              <TouchableOpacity
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.selectedPlan,
                  { borderColor: plan.color }
                ]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <NeonGradient 
                    style={styles.popularTag}
                    colors={[theme.neonPink, theme.neonPurple]}
                  >
                    <Star size={12} color={theme.textPrimary} fill={theme.textPrimary} />
                    <Text style={styles.popularText}>MOST POPULAR</Text>
                  </NeonGradient>
                )}

                <View style={styles.planHeader}>
                  <NeonText 
                    text={plan.name}
                    color={plan.color}
                    size={20}
                    style={styles.planName}
                  />
                  <View style={styles.priceContainer}>
                    <Text style={styles.currency}>$</Text>
                    <Text style={styles.price}>{plan.price}</Text>
                    <Text style={styles.duration}>/{plan.duration}</Text>
                  </View>
                </View>

                <View style={styles.planFeatures}>
                  {plan.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureItem}>
                      <Check size={16} color={plan.color} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.planStats}>
                  <View style={styles.statItem}>
                    <Video size={20} color={plan.color} />
                    <Text style={styles.statValue}>
                      {plan.id === 'basic' ? '5h' : plan.id === 'premium' ? '20h' : '100h'}
                    </Text>
                    <Text style={styles.statLabel}>Video Calls</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Clock size={20} color={plan.color} />
                    <Text style={styles.statValue}>
                      {plan.id === 'basic' ? '24h' : plan.id === 'premium' ? '48h' : '72h'}
                    </Text>
                    <Text style={styles.statLabel}>Match Time</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <GradientButton 
          text="Subscribe Now"
          onPress={() => {
            // Handle subscription
            router.back();
          }}
          style={styles.subscribeButton}
          gradientColors={[theme.neonPink, theme.neonPurple]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    marginBottom: 0,
  },
  content: {
    flex: 1,
  },
  hero: {
    margin: 20,
    padding: 0,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  heroContent: {
    padding: 20,
    alignItems: 'center',
  },
  heroTitle: {
    marginVertical: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  plans: {
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    shadowColor: theme.neonPink,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedPlan: {
    backgroundColor: theme.surfaceLight,
  },
  popularTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  popularText: {
    color: theme.textPrimary,
    fontSize: 10,
    fontWeight: '600',
  },
  planHeader: {
    marginBottom: 20,
  },
  planName: {
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    marginHorizontal: 2,
    color: theme.textPrimary,
  },
  duration: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  planFeatures: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  planStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 4,
    color: theme.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.border,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  subscribeButton: {
    width: '100%',
  },
});