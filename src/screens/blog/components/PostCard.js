import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [commentLiked, setCommentLiked] = useState(false);
  
  const [likeCount, setLikeCount] = useState(post.likes ?? 0);
  const [commentCount, setCommentCount] = useState(post.comments ?? 0);
  const [shareCount, setShareCount] = useState(post.shares ?? 0);

  useEffect(() => {
    setLikeCount(post.likes ?? 0);
    setCommentCount(post.comments ?? 0);
    setShareCount(post.shares ?? 0);
  }, [post]);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  // QUAN TRỌNG: Kiểm tra cả 2 trường hợp tên biến 'image' (mock) và 'imageUri' (SQLite)
  const displayImage = post.imageUri || post.image;
  
  // Xử lý avatar: Nếu bài của cậu (PongTon) thì lấy avatar mặc định, nếu không lấy từ post
  const displayAvatar = post.userName === "PongTon" 
    ? "https://i.pravatar.cc/300?img=11" 
    : (post.userAvatar || "https://i.pravatar.cc/150?u=anonymous");

  return (
    <View style={styles.card}>
      {/* 1. Thông tin người đăng */}
      <View style={styles.userInfo}>
        <Image source={{ uri: displayAvatar }} style={styles.avatar} />
        <View>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.date}>{post.date}</Text>
        </View>
      </View>

      {/* 2. Nội dung bài viết */}
      <Text style={styles.postTitle}>{post.title}</Text>
      
      {/* HIỂN THỊ ẢNH: Đã fix để nhận imageUri từ database */}
      {displayImage ? (
        <Image 
          source={{ uri: displayImage }} 
          style={styles.postImage} 
          resizeMode="cover"
        />
      ) : null}

      {/* 3. Dòng thống kê */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {likeCount} Likes • {commentCount} Comments • {shareCount} Shares
        </Text>
      </View>

      {/* 4. Các nút bấm tương tác chính */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Ionicons 
            name={liked ? "thumbs-up" : "thumbs-up-outline"} 
            size={20} 
            color={liked ? "#1A4DAB" : "#666"} 
          />
          <Text style={[styles.actionText, liked && { color: "#1A4DAB" }]}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setCommentCount(prev => prev + 1)}>
          <Ionicons name="chatbubble-outline" size={18} color="#666" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setShareCount(prev => prev + 1)}>
          <Ionicons name="share-social-outline" size={20} color="#666" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* 5. Phần Comment */}
      {post.commentText ? (
        <View style={styles.commentSection}>
          <Image source={{ uri: post.commentAvatar || "https://i.pravatar.cc/150?u=comment" }} style={styles.commentAvatar} />
          <View style={{ flex: 1 }}>
            <View style={styles.commentBubble}>
              <Text style={styles.commentUser}>{post.commentUser}</Text>
              <Text style={styles.commentText}>{post.commentText}</Text>
            </View>
            <View style={styles.commentActions}>
               <TouchableOpacity onPress={() => setCommentLiked(!commentLiked)}>
                  <Text style={[styles.commentActionTextBold, commentLiked && { color: '#1A4DAB' }]}>Like</Text>
               </TouchableOpacity>
               <TouchableOpacity><Text style={styles.commentActionTextBold}>Reply</Text></TouchableOpacity>
               <Text style={styles.commentActionText}>5m</Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', paddingVertical: 15, borderBottomWidth: 8, borderBottomColor: '#F2F2F2' },
  userInfo: { flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center', marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  userName: { fontWeight: 'bold', fontSize: 15, fontFamily: 'Montserrat-Bold' },
  date: { color: '#999', fontSize: 12, fontFamily: 'Montserrat' },
  postTitle: { fontSize: 16, paddingHorizontal: 15, marginBottom: 10, fontFamily: 'Montserrat', color: '#111' },
  postImage: { width: '100%', height: 300, marginTop: 5, backgroundColor: '#eee' },
  
  countRow: { paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#EEE' },
  countText: { color: '#666', fontSize: 13, fontFamily: 'Montserrat' },
  
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 5 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  actionText: { color: '#666', marginLeft: 6, fontSize: 14, fontWeight: '500', fontFamily: 'Montserrat-SemiBold' },

  commentSection: { flexDirection: 'row', paddingHorizontal: 15, marginTop: 12 },
  commentAvatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10 },
  commentBubble: { backgroundColor: '#F0F2F5', padding: 10, borderRadius: 15, alignSelf: 'flex-start', maxWidth: '90%' },
  commentUser: { fontWeight: 'bold', fontSize: 14, marginBottom: 2, fontFamily: 'Montserrat-Bold' },
  commentText: { fontSize: 14, color: '#333', fontFamily: 'Montserrat' },
  
  commentActions: { flexDirection: 'row', marginTop: 4, marginLeft: 10, alignItems: 'center' },
  commentActionTextBold: { fontWeight: 'bold', fontSize: 12, marginRight: 15, color: '#65676B', fontFamily: 'Montserrat-Bold' },
  commentActionText: { fontSize: 12, color: '#8A8D91', fontFamily: 'Montserrat' }
});

export default PostCard;