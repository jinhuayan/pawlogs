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

const LoginScreen: React.FC = () => {  
  const [email, setEmail] = useState('');  // Changed from username to email  
  const [password, setPassword] = useState('');  
  const [loading, setLoading] = useState(false);  

  async function handleLogin() {  
    if (!email.trim() || !password.trim()) {  
      Alert.alert('Missing Fields', 'Please enter both email and password.');  
      return;  
    }  

    setLoading(true);  

    const { error } = await supabase.auth.signInWithPassword({  
      email: email,  // Using email now  
      password: password,  
    });  

    if (error) {  
      Alert.alert('Login Failed', error.message);  
    } else {  
      router.push('/');  
    }  

    setLoading(false);  
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
          onChangeText={setEmail}  
          autoCapitalize="none"  
          keyboardType="email-address"  // Optimized for email input 
        />  
        <TextInput  
          style={styles.input}  
          placeholder="Password"  
          value={password}  
          onChangeText={setPassword}  
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
