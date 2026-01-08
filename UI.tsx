import React, { useState, useEffect } from 'react';
import { View, Button, Alert, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '48475528916-v4j2qg40mtqlt256iige8pj4nrk0nr9h.apps.googleusercontent.com', 
      
      offlineAccess: true, 
    });
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      
      const userInfo = await GoogleSignin.signIn();
      
      const { accessToken } = await GoogleSignin.getTokens();
      console.log('Access Token từ Google:', accessToken);

      await callBackend(accessToken);

    } catch (error) {
      setLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Hủy đăng nhập');
      } else {
        Alert.alert('Lỗi Google', error.message);
      }
    }
  };

  const callBackend = async (token) => {
    try {
      const response = await fetch('https://bkapp-mp8l.onrender.com/auth/social/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',       
          access_token: token,      
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Đăng nhập thành công!
        Alert.alert('Thành công', `Token Django: ${data.key}`);
        // TODO: Lưu data.key vào AsyncStorage và chuyển màn hình
      } else {
        console.log('Lỗi Backend:', data);
        Alert.alert('Lỗi đăng nhập', JSON.stringify(data));
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Lỗi mạng', 'Không kết nối được tới server Django');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{marginBottom: 20, fontSize: 18}}>Test Google Login</Text>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <Button title="Đăng nhập bằng Google" onPress={signIn} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default LoginScreen;