import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { Settings, MapPin, ChevronRight, Camera, Globe, Briefcase, GraduationCap, Heart, Music, Crown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../_layout';
import NeonText from '../../components/NeonText';
import Card from '../../components/Card';
import NeonGradient from '../../components/NeonGradient';
import GradientButton from '../../components/GradientButton';

const INTERESTS = [
  { id: 'travel', name: 'Travel ✈️' },
  { id: 'movies', name: 'Movies 🎬' },
  { id: 'art', name: 'Art 🎨' },
  { id: 'technology', name: 'Technology 📱' },
  { id: 'science', name: 'Science 🔬' }
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Andrew Wilson',
    age: '27',
    bio: 'Software engineer by day, photographer by night. Love traveling and meeting new people.',
    location: 'Chicago, IL',
    occupation: 'Software Engineer',
    company: 'Tech Corp',
    education: 'Computer Science, MIT',
    height: '6\'0"',
    languages: ['English', 'Spanish'],
    relationshipGoal: 'Long-term relationship',
    interests: INTERESTS.slice(0, 3),
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2574&auto=format&fit=crop'
    ]
  });

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <NeonGradient style={styles.profileIconContainer}>
            <Image 
              source={{ uri: profileData.photos[0] }}
              style={styles.profileIcon}
            />
          </NeonGradient>
          <View>
            <NeonText 
              text={profileData.name}
              color={theme.neonPink}
              size={18}
              style={styles.headerName}
            />
            <Text style={styles.headerLocation}>
              <MapPin size={14} color={theme.textSecondary} /> {profileData.location}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={() => router.push('/subscription')}
          >
            <Crown size={20} color={theme.neonBlue} />
            <Text style={styles.upgradeText}>Premium</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Settings size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <Card style={styles.photosSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.photosContainer}
        >
          {profileData.photos.map((photo, index) => (
            <NeonGradient 
              key={index} 
              style={styles.photoContainer}
              colors={[theme.neonPink, theme.neonPurple]}
            >
              <Image source={{ uri: photo }} style={styles.photo} />
            </NeonGradient>
          ))}
          <TouchableOpacity style={styles.addPhotoButton}>
            <Camera size={24} color={theme.textSecondary} />
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </TouchableOpacity>
        </ScrollView>
      </Card>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.bioText}>{profileData.bio}</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Info</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Briefcase size={20} color={theme.neonPink} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Work</Text>
            <Text style={styles.infoValue}>{profileData.occupation} at {profileData.company}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <GraduationCap size={20} color={theme.neonBlue} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Education</Text>
            <Text style={styles.infoValue}>{profileData.education}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Globe size={20} color={theme.neonPurple} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Languages</Text>
            <Text style={styles.infoValue}>{profileData.languages.join(', ')}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Heart size={20} color={theme.neonPink} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Looking for</Text>
            <Text style={styles.infoValue}>{profileData.relationshipGoal}</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.interestsContainer}>
          {profileData.interests.map((interest) => (
            <NeonGradient
              key={interest.id}
              style={styles.interestTag}
              colors={[theme.neonPink, theme.neonPurple]}
            >
              <Text style={styles.interestText}>{interest.name}</Text>
            </NeonGradient>
          ))}
        </View>
      </Card>

      {isEditing && (
        <View style={styles.editActions}>
          <GradientButton
            text="Cancel"
            onPress={() => setIsEditing(false)}
            style={styles.cancelButton}
            gradientColors={[theme.surfaceLight, theme.surface]}
          />
          <GradientButton
            text="Save Changes"
            onPress={() => setIsEditing(false)}
            style={styles.saveButton}
            gradientColors={[theme.neonPink, theme.neonPurple]}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2,
  },
  profileIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  headerName: {
    marginBottom: 4,
  },
  headerLocation: {
    fontSize: 14,
    color: theme.textSecondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.neonBlue}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  upgradeText: {
    color: theme.neonBlue,
    fontSize: 14,
    fontWeight: '600',
  },
  settingsButton: {
    padding: 8,
  },
  photosSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  editText: {
    color: theme.neonPink,
    fontSize: 16,
    fontWeight: '500',
  },
  photosContainer: {
    flexDirection: 'row',
  },
  photoContainer: {
    marginRight: 12,
    borderRadius: 12,
    padding: 2,
  },
  photo: {
    width: 120,
    height: 160,
    borderRadius: 10,
  },
  addPhotoButton: {
    width: 120,
    height: 160,
    borderRadius: 12,
    backgroundColor: theme.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    borderStyle: 'dashed',
  },
  addPhotoText: {
    marginTop: 8,
    color: theme.textSecondary,
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: theme.textPrimary,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    color: theme.textPrimary,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});