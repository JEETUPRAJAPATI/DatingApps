import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Platform, Pressable, Modal } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Camera, Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from './_layout';
import NeonText from '../components/NeonText';
import GradientButton from '../components/GradientButton';
import Card from '../components/Card';
import NeonGradient from '../components/NeonGradient';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const handleContinue = () => {
    if (firstName && lastName && birthDate) {
      router.push('/gender');
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + increment);
    setSelectedMonth(newDate);
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(selectedMonth);
    newDate.setDate(day);
    setSelectedDate(newDate);
    setBirthDate(newDate);
  };

  const saveDateSelection = () => {
    setBirthDate(selectedDate);
    setShowDatePicker(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/gender')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <NeonText 
        text="Profile details"
        color={theme.neonPink}
        size={32}
        style={styles.title}
      />

      <View style={styles.imageContainer}>
        <NeonGradient
          style={styles.imageWrapper}
          colors={[theme.neonPink, theme.neonPurple]}
        >
          <Image
            source={profileImage ? { uri: profileImage } : { uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop' }}
            style={styles.profileImage}
          />
        </NeonGradient>
        <TouchableOpacity style={styles.cameraButton}>
          <Camera size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <Card style={styles.form}>
        <Text style={styles.label}>First name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
          placeholderTextColor={theme.textSecondary}
          selectionColor={theme.neonPink}
          color={theme.textPrimary}
        />

        <Text style={styles.label}>Last name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
          placeholderTextColor={theme.textSecondary}
          selectionColor={theme.neonPink}
          color={theme.textPrimary}
        />

        <Text style={styles.label}>Birthday</Text>
        <Pressable 
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Calendar size={20} color={theme.neonPink} style={styles.calendarIcon} />
          <Text style={styles.dateButtonText}>
            {birthDate ? formatDate(birthDate) : 'Select your birthday'}
          </Text>
        </Pressable>
      </Card>

      <GradientButton
        text="Continue"
        onPress={handleContinue}
        disabled={!firstName || !lastName || !birthDate}
        style={styles.continueButton}
        gradientColors={[theme.neonPink, theme.neonPurple]}
      />

      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.datePickerContainer}>
            <NeonText 
              text="Birthday"
              color={theme.neonBlue}
              size={24}
              style={styles.datePickerTitle}
            />
            
            <View style={styles.monthSelector}>
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <ChevronLeft size={24} color={theme.textPrimary} />
              </TouchableOpacity>
              
              <Text style={styles.monthYear}>
                {selectedMonth.toLocaleString('default', { 
                  month: 'long',
                  year: 'numeric'
                })}
              </Text>
              
              <TouchableOpacity onPress={() => changeMonth(1)}>
                <ChevronRight size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.calendar}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <Text key={day} style={styles.dayHeader}>{day}</Text>
              ))}
              
              {getDaysInMonth(selectedMonth).map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    day === selectedDate.getDate() && 
                    selectedMonth.getMonth() === selectedDate.getMonth() && 
                    styles.selectedDay
                  ]}
                  onPress={() => day && handleDateSelect(day)}
                  disabled={!day}
                >
                  <Text style={[
                    styles.dayText,
                    day === selectedDate.getDate() && 
                    selectedMonth.getMonth() === selectedDate.getMonth() && 
                    styles.selectedDayText
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <GradientButton 
              text="Save"
              onPress={saveDateSelection}
              style={styles.saveButton}
              gradientColors={[theme.neonPink, theme.neonPurple]}
            />
          </Card>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  skipText: {
    color: theme.neonPink,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    marginBottom: 40,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 40,
  },
  imageWrapper: {
    padding: 3,
    borderRadius: 60,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: theme.neonPink,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.neonPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  form: {
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: theme.surfaceLight,
    color: theme.textPrimary,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surfaceLight,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  dateButtonText: {
    fontSize: 16,
    color: theme.textPrimary,
    marginLeft: 10,
  },
  calendarIcon: {
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    width: '90%',
    padding: 20,
    alignItems: 'center',
  },
  datePickerTitle: {
    marginBottom: 20,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.neonBlue,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  dayHeader: {
    width: '14.28%',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  dayButton: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  selectedDay: {
    backgroundColor: theme.neonPink,
    borderRadius: 20,
    shadowColor: theme.neonPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  dayText: {
    fontSize: 16,
    color: theme.textPrimary,
  },
  selectedDayText: {
    color: theme.textPrimary,
    fontWeight: '600',
  },
  saveButton: {
    width: '100%',
    marginTop: 20,
  },
  continueButton: {
    marginTop: 'auto',
  },
});