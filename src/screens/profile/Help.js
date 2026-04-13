import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  ScrollView, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, Linking 
} from 'react-native';
import { faqData, userProfile } from '../../data/userData';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const GEMINI_API_KEY = "API_KEY"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

const QUICK_QUESTIONS = [
  "How to lose weight fast?",
  "Best exercises for abs",
  "Diet for muscle gain",
  "How many times should I workout?",
  "Benefits of cardio"
];

export default function Help() {
  const [activeTab, setActiveTab] = useState('FAQ');
  const [expandedId, setExpandedId] = useState(null);

  const [messages, setMessages] = useState([
    { id: '1', text: "Hello! I'm your AI Fitness Coach. I can help you with workouts, gym, and nutrition. Ask me anything!", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const callGeminiAPI = async (userQuery) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ 
              text: `You are a strict and professional AI Fitness Coach. 
                     Your role is to ONLY answer questions related to: Fitness, Gym, Workouts, Exercises, Nutrition, Diet, and Health.
                     
                     RULES:
                     1. If the user asks about fitness/health, provide a helpful, short, and concise answer in ENGLISH.
                     2. If the user asks about ANY other topic, refuse to answer politely.
                     
                     User Question: "${userQuery}"` 
            }]
          }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "Sorry, I am having trouble connecting to the server.";
      }
    } catch (error) {
      return "Network error. Please check your connection.";
    }
  };

  const sendMessage = async (text) => {
    if (!text || text.trim() === "") return;

    const userMsg = { id: Date.now().toString(), text: text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);

    const botReplyText = await callGeminiAPI(text);
    
    const botMsg = { id: (Date.now() + 1).toString(), text: botReplyText, sender: 'bot' };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const renderFAQ = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.contentContainer}>
      {faqData.map((item) => (
        <View key={item.id} style={styles.faqItem}>
          <TouchableOpacity style={styles.faqHeader} onPress={() => toggleExpand(item.id)}>
            <Text style={styles.question}>{item.question}</Text>
            <Ionicons name={expandedId === item.id ? "caret-up" : "caret-down"} size={16} color="#FF5722" />
          </TouchableOpacity>
          {expandedId === item.id && (
            <View style={styles.faqBody}>
              <Text style={styles.answer}>{item.answer}</Text>
            </View>
          )}
          <View style={styles.divider} />
        </View>
      ))}
      <View style={{height: 100}} /> 
    </ScrollView>
  );

  const renderContact = () => (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.contactCard}>
        <View style={styles.contactRow}>
          <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="call" size={20} color="#1A56DB" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.contactLabel}>Phone Support</Text>
            <Text style={styles.contactValue} onPress={() => Linking.openURL(`tel:${userProfile.details.phone}`)}>
              {userProfile.details.phone}
            </Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="mail" size={20} color="#D32F2F" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>fuitness@gm.uit.edu.vn</Text>
          </View>
        </View>

        <View style={styles.contactRow}>
          <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="location" size={20} color="#388E3C" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.contactLabel}>Headquarters</Text>
            <Text style={styles.contactValue}>UIT, Ho Chi Minh City, Vietnam</Text>
          </View>
        </View>
      </View>

      <Text style={styles.socialTitle}>Follow Us</Text>
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialBtn}><FontAwesome5 name="facebook" size={24} color="#1877F2" /></TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}><FontAwesome5 name="instagram" size={24} color="#E4405F" /></TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}><FontAwesome5 name="twitter" size={24} color="#1DA1F2" /></TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}><FontAwesome5 name="youtube" size={24} color="#FF0000" /></TouchableOpacity>
      </View>
      <View style={{height: 100}} /> 
    </ScrollView>
  );

  const renderAIChat = () => (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        style={styles.chatList}
        contentContainerStyle={{ paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.msgBubble, item.sender === 'user' ? styles.userMsg : styles.botMsg]}>
            <Text style={[styles.msgText, item.sender === 'user' ? { color: '#FFF' } : { color: '#333' }]}>
              {item.text}
            </Text>
          </View>
        )}
      />
      
      <View style={styles.bottomChatArea}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickQuestionsContainer}>
          {QUICK_QUESTIONS.map((q, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.quickBtn}
              onPress={() => sendMessage(q)}
              disabled={isLoading}
            >
              <Text style={styles.quickBtnText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.chatInputContainer}>
          <TextInput
            style={styles.chatInput}
            placeholder="Ask AI Coach..."
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(inputText)} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFF" size="small" /> : <Ionicons name="send" size={20} color="#FFF" />}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {['FAQ', 'Contact', 'AI Coach'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text 
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flex: 1 }}>
        {activeTab === 'FAQ' && renderFAQ()}
        {activeTab === 'Contact' && renderContact()}
        {activeTab === 'AI Coach' && renderAIChat()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 20 },
  
  tabContainer: { flexDirection: 'row', borderWidth: 1, borderColor: '#eee', borderRadius: 20, backgroundColor: '#F5F5F5', marginBottom: 15, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, paddingHorizontal: 5 },
  activeTab: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: '#888' },
  activeTabText: { color: '#1A56DB' },

  contentContainer: { flex: 1 },

  faqItem: { marginBottom: 15 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  question: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: '#333', flex: 1, marginRight: 10 },
  faqBody: { marginTop: 5, marginBottom: 10 },
  answer: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: '#666', lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginTop: 10 },

  contactCard: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 20, marginBottom: 20 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  contactLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: '#333' },
  contactValue: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: '#555', marginTop: 2 },
  socialTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, textAlign: 'center', marginBottom: 15 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  socialBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F2F5', justifyContent: 'center', alignItems: 'center' },

  chatList: { flex: 1, paddingHorizontal: 5 },
  msgBubble: { padding: 12, borderRadius: 16, maxWidth: '80%', marginBottom: 10 },
  userMsg: { alignSelf: 'flex-end', backgroundColor: '#1A56DB', borderBottomRightRadius: 2 },
  botMsg: { alignSelf: 'flex-start', backgroundColor: '#F0F0F0', borderBottomLeftRadius: 2 },
  msgText: { fontFamily: 'Montserrat_400Regular', fontSize: 14, lineHeight: 20 },
  
  bottomChatArea: { 
    borderTopWidth: 1, 
    borderTopColor: '#eee', 
    backgroundColor: '#fff',
    marginBottom: 80, 
    paddingBottom: 20 
  },

  quickQuestionsContainer: { flexGrow: 0, paddingVertical: 10, paddingHorizontal: 5 },
  quickBtn: { backgroundColor: '#EAF4FF', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, borderWidth: 1, borderColor: '#1A56DB' },
  quickBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: '#1A56DB' },

  chatInputContainer: { flexDirection: 'row', alignItems: 'center', paddingTop: 5 },
  chatInput: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, fontFamily: 'Montserrat_400Regular', marginRight: 10, fontSize: 14 },
  sendBtn: { backgroundColor: '#1A56DB', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});