import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Settings, CreditCard as Edit3, MapPin, ChevronRight, Camera, Globe, Briefcase, GraduationCap, Heart, Music, Crown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: profileData.photos[0] }}
            style={styles.profileIcon}
          />
          <View>
            <Text style={styles.headerName}>{profileData.name}</Text>
            <Text style={styles.headerLocation}>
              <MapPin size={14} color="#666" /> {profileData.location}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={() => router.push('/subscription')}
          >
            <Crown size={20} color="#F59E0B" />
            <Text style={styles.upgradeText}>Premium</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Settings size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.photosSection}>
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
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photo} />
              {isEditing && (
                <TouchableOpacity style={styles.removePhotoButton}>
                  <Text style={styles.removePhotoText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          {isEditing && (
            <TouchableOpacity style={styles.addPhotoButton}>
              <Camera size={24} color="#666" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        {isEditing ? (
          <TextInput
            style={styles.bioInput}
            multiline
            value={profileData.bio}
            onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
            placeholder="Tell us about yourself..."
          />
        ) : (
          <Text style={styles.bioText}>{profileData.bio}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Info</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Briefcase size={20} color="#666" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Work</Text>
            <Text style={styles.infoValue}>{profileData.occupation} at {profileData.company}</Text>
          </View>
          {isEditing && (
            <TouchableOpacity style={styles.editButton}>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <GraduationCap size={20} color="#666" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Education</Text>
            <Text style={styles.infoValue}>{profileData.education}</Text>
          </View>
          {isEditing && (
            <TouchableOpacity style={styles.editButton}>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Globe size={20} color="#666" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Languages</Text>
            <Text style={styles.infoValue}>{profileData.languages.join(', ')}</Text>
          </View>
          {isEditing && (
            <TouchableOpacity style={styles.editButton}>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Heart size={20} color="#666" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Looking for</Text>
            <Text style={styles.infoValue}>{profileData.relationshipGoal}</Text>
          </View>
          {isEditing && (
            <TouchableOpacity style={styles.editButton}>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.interestsContainer}>
          {profileData.interests.map((interest) => (
            <View key={interest.id} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest.name}</Text>
              {isEditing && (
                <TouchableOpacity style={styles.removeInterestButton}>
                  <Text style={styles.removeInterestText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          {isEditing && (
            <TouchableOpacity style={styles.addInterestButton}>
              <Text style={styles.addInterestText}>+ Add Interest</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isEditing && (
        <View style={styles.editActions}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setIsEditing(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerLocation: {
    fontSize: 14,
    color: '#666',
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
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  upgradeText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
  },
  settingsButton: {
    padding: 8,
  },
  section: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
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
  },
  editText: {
    color: '#FF4B6A',
    fontSize: 16,
    fontWeight: '500',
  },
  photosContainer: {
    flexDirection: 'row',
    paddingBottom: 16,
  },
  photoContainer: {
    marginRight: 12,
    position: 'relative',
  },
  photo: {
    width: 120,
    height: 160,
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  addPhotoButton: {
    width: 120,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addPhotoText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
  },
  editButton: {
    padding: 8,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    marginRight: 8,
  },
  removeInterestButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeInterestText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  addInterestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addInterestText: {
    fontSize: 14,
    color: '#666',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FF4B6A',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});