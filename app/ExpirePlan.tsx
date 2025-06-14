// app/ExpirePlan.tsx
import { decodeAuthToken, useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, useWindowDimensions, View } from 'react-native';
import HTMLView from 'react-native-htmlview';

export interface DecodedAuthToken {
  sub: string;
  exp: number;
  iat: number;
  name?: string;
  role?: string;
  phone_number?: string;
}

export default function ExpirePlan() {
  const { width } = useWindowDimensions();
  const { logout } = useAuth();
  const [userDetails, setUserDetails] = useState<DecodedAuthToken | null>(null);
  const [message, setMessage] = useState<string>('');

  // 1️⃣ Get decoded token
  useEffect(() => {
    decodeAuthToken().then(setUserDetails).catch(() => {

    });
  }, []);

  useEffect(() => {
    if (userDetails?.phone_number) {
      axios
        .get(
          `https://api.pridecons.sbs/plan/check-plan/${userDetails.phone_number}`
        )
        .then(response => {
          console.log("response : ",response?.data)
          setMessage(response.data.message);
        })
        .catch(() => {
          setMessage('Unable to verify plan. Please try again later.');
        });
    } 
  }, [userDetails]);

  const router = useRouter();

  return (
    <View style={styles.container}>
        <HTMLView
        value={message || ''}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Renew Plan"
          onPress={() => {
            // TODO: replace '/renew' with your actual renewal screen route
            // router.push('/renew');
          }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Logout"
          onPress={async () => {
              try {
                await logout();
              } catch (error) {
                console.error('Error during logout:', error);
                Alert.alert('Error', 'Failed to logout. Please try again.');
              }
            }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    marginVertical: 8,
  },
});
