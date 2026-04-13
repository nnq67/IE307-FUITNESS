import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import PostCard from '../components/PostCard';
import { mockData } from '../../../data/mockData';

const FollowingTab = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={mockData} 
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});

export default FollowingTab;