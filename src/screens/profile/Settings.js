import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function Settings() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Menu Options */}
      <TouchableOpacity 
        style={styles.item} 
        onPress={() => navigation.navigate('ProfileSetting')}
      >
        <View style={styles.iconBox}><Ionicons name="person" size={24} color="#fff" /></View>
        <Text style={styles.itemText}>Profile Setting</Text>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.item} 
        onPress={() => setModalVisible(true)}
      >
        <View style={[styles.iconBox, { backgroundColor: '#FF5722' }]}>
          <MaterialIcons name="delete" size={24} color="#fff" />
        </View>
        <Text style={styles.itemText}>Delete Account</Text>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>

      {/* DELETE ACCOUNT MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalContent}>
               <Text style={styles.modalTitle}>DELETE ACCOUNT</Text>
               <Text style={styles.modalText}>
                 Are you sure you want to <Text style={{fontFamily: 'Montserrat_700Bold'}}>delete your account</Text>? 
                 This will permanently erase your account.
               </Text>
               
               <View style={styles.modalButtons}>
                 <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setModalVisible(false)}>
                   <Text style={styles.btnText}>Cancel</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={[styles.btn, styles.btnSure]} onPress={() => alert('Account Deleted')}>
                   <Text style={[styles.btnText, {color:'#fff'}]}>Sure</Text>
                 </TouchableOpacity>
               </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  iconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A56DB', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  
  itemText: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: '#000' },
  
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 5 }, 
  modalContent: { 
    borderColor: 'red', borderWidth: 2, borderRadius: 18, 
    padding: 20, alignItems: 'center', backgroundColor: '#fff' 
  },
  modalTitle: { fontFamily: 'AlfaSlabOne_400Regular', fontSize: 20, color: '#000', marginBottom: 15 },
  modalText: { fontFamily: 'Montserrat_400Regular', fontSize: 14, textAlign: 'center', marginBottom: 20, color: '#333' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  btn: { borderRadius: 20, paddingVertical: 10, width: '45%', alignItems: 'center' },
  btnCancel: { backgroundColor: '#E0E0E0' },
  btnSure: { backgroundColor: '#FF4400' },
  btnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14 },
});