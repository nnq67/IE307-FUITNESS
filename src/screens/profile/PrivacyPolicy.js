import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

export default function PrivacyPolicy() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 40}}>
      <Text style={styles.paragraph}>
        Your privacy is important to us. It is Brainstorming's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.
      </Text>
      <Text style={styles.paragraph}>
        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
      </Text>
      <Text style={styles.paragraph}>
        We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
      </Text>
      <Text style={styles.paragraph}>
        We don’t share any personally identifying information publicly or with third-parties, except when required by law.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  paragraph: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'justify'
  }
});