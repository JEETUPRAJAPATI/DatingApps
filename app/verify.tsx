import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

export default function VerifyScreen() {
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-advance to next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if code is complete
    if (index === 3 && text) {
      const enteredCode = newCode.join('');
      if (enteredCode === '1234') { // Demo correct code
        router.push('/profile');
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 1000);
        setCode(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setTimeLeft(60);
    setIsResending(false);
  };

  const shakeAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: shake
          ? withSequence(
              withTiming(10, { duration: 100 }),
              withTiming(-10, { duration: 100 }),
              withTiming(10, { duration: 100 }),
              withTiming(0, { duration: 100 })
            )
          : 0,
      },
    ],
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.timer}>
        {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
        {String(timeLeft % 60).padStart(2, '0')}
      </Text>

      <Text style={styles.title}>Type the verification code we've sent you</Text>

      <Animated.View style={[styles.codeContainer, shakeAnimation]}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.codeInput,
              digit && styles.codeInputFilled,
              shake && styles.codeInputError,
            ]}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </Animated.View>

      <TouchableOpacity
        style={[
          styles.resendButton,
          (timeLeft > 0 || isResending) && styles.resendButtonDisabled,
        ]}
        onPress={handleResend}
        disabled={timeLeft > 0 || isResending}
      >
        <Text style={[
          styles.resendText,
          (timeLeft > 0 || isResending) && styles.resendTextDisabled,
        ]}>
          {isResending ? 'Sending...' : 'Send code again'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  codeInput: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  codeInputFilled: {
    borderColor: '#FF4B6A',
    backgroundColor: '#fff5f7',
  },
  codeInputError: {
    borderColor: '#FF4B6A',
    backgroundColor: '#fff5f7',
  },
  resendButton: {
    padding: 15,
    alignItems: 'center',
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: '#FF4B6A',
    fontSize: 16,
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: '#666',
  },
});