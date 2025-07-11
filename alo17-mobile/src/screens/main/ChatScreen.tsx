import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../types/navigation';
import {
  connectSocket,
  joinRoom,
  sendMessage as sendSocketMessage,
  onMessage,
  disconnectSocket,
  markMessageAsRead,
  onMessageRead,
} from '../../services/socketService';
import axios from 'axios';

const { width } = Dimensions.get('window');

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  isRead: boolean;
}

const ChatScreen: React.FC = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let isMounted = true;
    let roomId = '';
    const setupSocket = async () => {
      // Room ID iki kullanıcının id'sinden oluşturuluyor (sıralı olsun diye küçükten büyüğe)
      const ids = [user?.id, route.params.recipientId].sort();
      roomId = `room_${ids[0]}_${ids[1]}`;
      await connectSocket();
      joinRoom(roomId);
      onMessage((msg) => {
        if (isMounted) setMessages((prev) => [...prev, msg]);
        // Eğer gelen mesaj bana aitse ve okunmadıysa okundu olarak işaretle
        if (msg.receiverId === user?.id && !msg.isRead) {
          markMessageAsRead(msg.id, roomId);
        }
      });
      // Okundu event'ını dinle
      onMessageRead(({ messageId, readerId }) => {
        setMessages((prev) => prev.map((m) =>
          m.id === messageId ? { ...m, isRead: true } : m
        ));
      });
      // --- Mesaj geçmişini yükle ---
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}/api/messages/history`,
          {
            params: { roomId },
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        if (isMounted && res.data?.messages) {
          setMessages(res.data.messages);
          // Okunmamış mesajları okundu olarak işaretle
          res.data.messages.forEach((msg: any) => {
            if (msg.receiverId === user?.id && !msg.isRead) {
              markMessageAsRead(msg.id, roomId);
            }
          });
        }
      } catch (err) {
        // Hata yönetimi
      } finally {
        setIsLoading(false);
      }
      // --- ---
    };
    setupSocket();
    return () => {
      isMounted = false;
      disconnectSocket();
    };
  }, [route.params.recipientId, user?.id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const ids = [user?.id, route.params.recipientId].sort();
    const roomId = `room_${ids[0]}_${ids[1]}`;
    sendSocketMessage({
      content: newMessage.trim(),
      receiverId: route.params.recipientId,
      roomId,
      // listingId: ... (gerekirse eklenir)
    });
    setNewMessage('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderId === user?.id;

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
      ]}>
        <View style={[
          styles.messageBubble,
          {
            backgroundColor: isOwnMessage ? theme.colors.primary : theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}>
          <Text style={[
            styles.messageText,
            { color: isOwnMessage ? theme.colors.background : theme.colors.text },
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            { color: isOwnMessage ? theme.colors.background : theme.colors.textSecondary },
          ]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            },
          ]}
          placeholder="Mesajınızı yazın..."
          placeholderTextColor={theme.colors.textSecondary}
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: newMessage.trim() ? theme.colors.primary : theme.colors.border,
            },
          ]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Text style={[
            styles.sendButtonText,
            { color: newMessage.trim() ? theme.colors.background : theme.colors.textSecondary },
          ]}>
            Gönder
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatScreen; 