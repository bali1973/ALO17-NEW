import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../types/navigation';

type MessagesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

interface ChatPreview {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  listingTitle: string;
}

const MessagesScreen: React.FC = () => {
  const navigation = useNavigation<MessagesScreenNavigationProp>();
  const { theme } = useTheme();
  
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    // TODO: Replace with actual API call
    const mockChats: ChatPreview[] = [
      {
        id: '1',
        recipientId: 'user1',
        recipientName: 'Ahmet Yılmaz',
        recipientAvatar: 'https://via.placeholder.com/50x50',
        lastMessage: 'Merhaba, ürün hala satılık mı?',
        lastMessageTime: '14:30',
        unreadCount: 2,
        listingTitle: 'iPhone 14 Pro Max',
      },
      {
        id: '2',
        recipientId: 'user2',
        recipientName: 'Ayşe Demir',
        recipientAvatar: 'https://via.placeholder.com/50x50',
        lastMessage: 'Fiyatta pazarlık yapabilir miyiz?',
        lastMessageTime: 'Dün',
        unreadCount: 0,
        listingTitle: 'MacBook Pro M2',
      },
      {
        id: '3',
        recipientId: 'user3',
        recipientName: 'Mehmet Kaya',
        recipientAvatar: 'https://via.placeholder.com/50x50',
        lastMessage: 'Ürünü görmek istiyorum',
        lastMessageTime: '2 gün önce',
        unreadCount: 1,
        listingTitle: 'Samsung Galaxy S23',
      },
    ];
    
    setChats(mockChats);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  };

  const handleChatPress = (chat: ChatPreview) => {
    navigation.navigate('Chat', {
      chatId: chat.id,
      recipientId: chat.recipientId,
      recipientName: chat.recipientName,
    });
  };

  const renderChatItem = ({ item }: { item: ChatPreview }) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
        },
      ]}
      onPress={() => handleChatPress(item)}
    >
      <Image source={{ uri: item.recipientAvatar }} style={styles.avatar} />
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.recipientName, { color: theme.colors.text }]}>
            {item.recipientName}
          </Text>
          <Text style={[styles.lastMessageTime, { color: theme.colors.textSecondary }]}>
            {item.lastMessageTime}
          </Text>
        </View>
        
        <Text style={[styles.listingTitle, { color: theme.colors.primary }]} numberOfLines={1}>
          {item.listingTitle}
        </Text>
        
        <View style={styles.messageContainer}>
          <Text style={[styles.lastMessage, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          
          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.unreadCount, { color: theme.colors.background }]}>
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Henüz mesajınız yok
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        İlanlara mesaj göndererek satıcılarla iletişime geçin
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Mesajlar
        </Text>
      </View>

      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600',
  },
  lastMessageTime: {
    fontSize: 12,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MessagesScreen; 