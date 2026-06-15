import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState, useRef } from 'react';
import { BUILDINGS } from '../data/campusData';

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

const CAMPUS_CONTEXT = `
You are CampusNav AI, a helpful assistant for students at FH Münster Technologie-Campus Steinfurt.
You know everything about the campus at Stegerwaldstraße 39, 48565 Steinfurt.

Campus Buildings:
${BUILDINGS.map(b => `- Gebäude ${b.shortName}: ${b.description}. Rooms: ${b.rooms.map(r => r.name + (r.description ? ' (' + r.description + ')' : '')).join(', ')}`).join('\n')}

Key locations:
- Bibliothek: Gebäude A, Erdgeschoss
- Mensa: Between buildings A and C
- Prüfungsamt Informatik: A 213
- AStA: Student House (Gebäude F)
- Große Hörsäle: S 001 and S 002 (up to 300 students)
- Informatik lectures: mainly in D 250, D 144, D 145, S 001

Answer in the same language the student uses (German or English).
Be concise, friendly and helpful. If asked for directions, describe the path clearly.
`;

const SUGGESTIONS = [
  'Wo ist die Bibliothek?',
  'Wie komme ich zur Mensa?',
  'Wo ist der Hörsaal D 250?',
  'Wo ist das Prüfungsamt Informatik?',
  'Welche Räume hat Gebäude S?',
  'Where is the AStA office?',
];

export default function AIScreen() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hallo! Ich bin dein CampusNav Assistent. Ich kann dir helfen, Räume zu finden, Wege zu beschreiben und Fragen zum Technologie-Campus Steinfurt zu beantworten. Was kann ich für dich tun?',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: CAMPUS_CONTEXT },
              ...newMessages.map(m => ({ role: m.role, content: m.content })),
            ],
            max_tokens: 1024,
          }),
        }
      );

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'Sorry, keine Antwort verfügbar.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Error: ${err.message}`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Text style={styles.headerEmoji}>🤖</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>CampusNav AI</Text>
          <Text style={styles.headerSub}>Powered by Groq · FH Münster Steinfurt</Text>
        </View>
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      </View>

      <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent}>
        {messages.map((msg, i) => (
          <View key={i} style={[styles.messageBubble, msg.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
            {msg.role === 'assistant' && <Text style={styles.bubbleIcon}>🤖</Text>}
            <View style={[styles.bubbleContent, msg.role === 'user' ? styles.userContent : styles.assistantContent]}>
              <Text style={[styles.bubbleText, msg.role === 'user' ? styles.userText : styles.assistantText]}>
                {msg.content}
              </Text>
            </View>
            {msg.role === 'user' && <Text style={styles.bubbleIcon}>👤</Text>}
          </View>
        ))}

        {loading && (
          <View style={[styles.messageBubble, styles.assistantBubble]}>
            <Text style={styles.bubbleIcon}>🤖</Text>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color="#10B981" />
              <Text style={styles.typingText}>Antwortet...</Text>
            </View>
          </View>
        )}

        {messages.length === 1 && (
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsTitle}>💡 Häufige Fragen</Text>
            {SUGGESTIONS.map((s, i) => (
              <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => sendMessage(s)}>
                <Text style={styles.suggestionText}>{s}</Text>
                <Text style={styles.suggestionArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Frage stellen... (DE/EN)"
          placeholderTextColor="#9CA3AF"
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#0F1623', padding: 16, paddingTop: 12 },
  headerIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(16,185,129,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerEmoji: { fontSize: 20 },
  headerTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  headerSub: { color: '#6B7280', fontSize: 11, marginTop: 1 },
  onlineBadge: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#10B981' },
  onlineText: { color: '#10B981', fontSize: 11, fontWeight: '600' },
  messages: { flex: 1 },
  messagesContent: { padding: 16, gap: 12 },
  messageBubble: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 },
  userBubble: { flexDirection: 'row-reverse' },
  assistantBubble: { flexDirection: 'row' },
  bubbleIcon: { fontSize: 20, marginBottom: 4 },
  bubbleContent: { maxWidth: '78%', borderRadius: 16, padding: 12 },
  userContent: { backgroundColor: '#0F1623', borderBottomRightRadius: 4 },
  assistantContent: { backgroundColor: '#fff', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  userText: { color: '#fff' },
  assistantText: { color: '#111827' },
  typingBubble: { backgroundColor: '#fff', borderRadius: 16, borderBottomLeftRadius: 4, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  typingText: { color: '#6B7280', fontSize: 13 },
  suggestions: { marginTop: 8 },
  suggestionsTitle: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  suggestionChip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 6 },
  suggestionText: { fontSize: 13, color: '#374151', flex: 1 },
  suggestionArrow: { fontSize: 18, color: '#9CA3AF' },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, backgroundColor: '#fff', padding: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  input: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#111827', maxHeight: 100, borderWidth: 1, borderColor: '#E5E7EB' },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: '#D1FAE5' },
  sendIcon: { color: '#fff', fontSize: 16 },
});
