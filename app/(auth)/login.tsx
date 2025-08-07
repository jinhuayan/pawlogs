import React, { useState } from 'react';  
import {  
  View,  
  TextInput,  
  Button,  
  StyleSheet,  
  Image,  
  TouchableOpacity,  
  Alert  
} from 'react-native';  
import { ThemedView } from '@/components/ThemedView';  
import { ThemedText } from '@/components/ThemedText';  
import { router } from 'expo-router';  
import { supabase } from '@/lib/supabase';  
import KeyboardAvoidingWrapper from '@/components/KeyboardAvoidingWrapper';  

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginScreen: React.FC = () => {  
  const [email, setEmail] = useState('');  // Changed from username to email  
  const [password, setPassword] = useState('');  
  const [loading, setLoading] = useState(false);  

  async function handleLogin() {  
    // Trim leading/trailing spaces
    const emailValue = email.trim();  
    const passwordValue = password.trim();

    // Validate presence
    if (!emailValue || !passwordValue) {  
      Alert.alert('Missing Fields', 'Please enter both email and password.');  
      return;  
    }  

    // Validate email format
    if (!EMAIL_REGEX.test(emailValue)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);  

    const { error } = await supabase.auth.signInWithPassword({  
      email: emailValue,  
      password: passwordValue,  
    }); 

    setLoading(false); 

    if (error) {  
      Alert.alert('Login Failed', error.message);  
    } else {  
      router.push('/');  
    }  
  }  

  return (  
    <KeyboardAvoidingWrapper>  
      <ThemedView style={styles.container}>  
        <Image  
          source={require('@/assets/ourimage/logo.png')}  
          style={styles.logo}  
          resizeMode="contain"  
        />  
        <ThemedText type="title" style={styles.title}>Login</ThemedText>  

        <TextInput  
          style={styles.input}  
          placeholder="Email"  //Changed from Username to Email 
          value={email}  // Using email state now 
          onChangeText={text => setEmail(text)}  
          autoCapitalize="none"  
          keyboardType="email-address"  // Optimized for email input 
        />  
        <TextInput  
          style={styles.input}  
          placeholder="Password"  
          value={password}  
          onChangeText={text => setPassword(text)}  
          secureTextEntry  
        />  

        <View style={styles.buttonContainer}>  
          <Button  
            title={loading ? 'Logging in...' : 'Login'}  
            onPress={handleLogin}  
            disabled={loading}  
          />  
        </View>  

        <TouchableOpacity onPress={() => router.push('/register')}>  
          <ThemedText style={styles.registerLink}>  
            Not registered? Register here  
          </ThemedText>  
        </TouchableOpacity>  
      </ThemedView>  
    </KeyboardAvoidingWrapper>  
  );  
};  

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    justifyContent: 'center',  
    alignItems: 'center',  
    padding: 24,  
    backgroundColor: 'transparent',  
  },  
  logo: {  
    width: 120,  
    height: 120,  
    marginBottom: 24,  
  },  
  title: {  
    marginBottom: 24,  
  },  
  input: {  
    width: '100%',  
    maxWidth: 300,  
    borderWidth: 1,  
    borderColor: '#ccc',  
    borderRadius: 6,  
    padding: 12,  
    marginBottom: 16,  
    fontSize: 16,  
    backgroundColor: '#f9f9f9',  
  },  
  buttonContainer: {  
    width: '100%',  
    maxWidth: 300,  
    marginTop: 8,  
  },  
  registerLink: {  
    color: '#007AFF',  
    marginTop: 16,  
    textAlign: 'center',  
    textDecorationLine: 'underline',  
    fontSize: 16,  
  },  
});  

export default LoginScreen;  
