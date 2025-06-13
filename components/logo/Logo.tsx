import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Logo({ isBlackLogo = false }) {
  return (
    <>
      {isBlackLogo ?
        <Image
          source={require('@/assets/images/logo/pride.png')}
          style={styles.logo}
        />
        :
        <View style={{ position: "relative", paddingHorizontal: 14 }}>
          <Image
            source={require('@/assets/images/logo/logo_w.png')}
            style={styles.logo}
          />
          <Text style={{ position: "absolute", right: 0, top: 2, color: "white", fontSize: 10 }}>TM</Text>
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 180,
    height: 50,
    // `objectFit: 'fill'` in web ⇒ `resizeMode: 'stretch'` in RN
    resizeMode: 'stretch',
  },
});
