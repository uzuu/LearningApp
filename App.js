import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { StatusBar } from 'expo-status-bar';

const STORAGE_KEY = 'learning-app-items-v1';
const REVIEW_DAY_STEPS = [1, 3, 7, 14, 30];

function addDays(baseDate, dayCount) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + dayCount);
  return date;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function toFriendlyDate(dateText) {
  const date = new Date(dateText);
  return date.toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function App() {
  const [topic, setTopic] = useState('');
  const [learnedDate, setLearnedDate] = useState(formatDate(new Date()));
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setItems(JSON.parse(raw));
        }
      } catch (error) {
        console.error('Хадгалсан мэдээлэл уншихад алдаа гарлаа', error);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch((error) => {
      console.error('Мэдээлэл хадгалах үед алдаа гарлаа', error);
    });
  }, [items]);

  const markedDates = useMemo(() => {
    const marks = {};
    items.forEach((item) => {
      item.reviewDates.forEach((reviewDate) => {
        if (!marks[reviewDate]) {
          marks[reviewDate] = {
            dots: [],
          };
        }
        marks[reviewDate].dots.push({
          key: `${item.id}-${reviewDate}`,
          color: '#4f46e5',
        });
      });
    });
    return marks;
  }, [items]);

  const createReminder = () => {
    if (!topic.trim()) {
      Alert.alert('Анхаар', 'Сурсан зүйлийн нэрээ оруулна уу.');
      return;
    }

    const parsedDate = new Date(learnedDate);
    if (Number.isNaN(parsedDate.getTime())) {
      Alert.alert('Огноо буруу байна', 'Огноог YYYY-MM-DD форматаар оруулна уу.');
      return;
    }

    const reviewDates = REVIEW_DAY_STEPS.map((step) =>
      formatDate(addDays(parsedDate, step))
    );

    const newItem = {
      id: Date.now().toString(),
      topic: topic.trim(),
      learnedDate: formatDate(parsedDate),
      reviewDates,
    };

    setItems((current) => [newItem, ...current]);
    setTopic('');
  };

  const removeItem = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>learningApp</Text>
        <Text style={styles.subtitle}>
          Шинээр сурсан зүйлээ бүртгээд forgetting curve (1, 3, 7, 14, 30 хоног)-ийн
          дагуу давтах өдрүүдээ календар дээр хараарай.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Сурсан зүйлийн нэр</Text>
          <TextInput
            style={styles.input}
            placeholder="Жишээ: React state management"
            value={topic}
            onChangeText={setTopic}
          />

          <Text style={styles.label}>Сурсан огноо (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={learnedDate}
            onChangeText={setLearnedDate}
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.button} onPress={createReminder}>
            <Text style={styles.buttonText}>Давталтын хуваарь үүсгэх</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Давталтын календар</Text>
          <Calendar
            markingType="multi-dot"
            markedDates={markedDates}
            theme={{
              todayTextColor: '#4f46e5',
              arrowColor: '#4f46e5',
            }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Миний сурсан зүйлс</Text>
          {items.length === 0 ? (
            <Text style={styles.empty}>Одоогоор бүртгэл алга.</Text>
          ) : (
            items.map((item) => (
              <View key={item.id} style={styles.itemBox}>
                <Text style={styles.itemTitle}>{item.topic}</Text>
                <Text style={styles.itemMeta}>
                  Сурсан огноо: {toFriendlyDate(item.learnedDate)}
                </Text>
                <Text style={styles.itemMeta}>
                  Давталтууд: {item.reviewDates.join(', ')}
                </Text>
                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>Устгах</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#312e81',
  },
  subtitle: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e1b4b',
  },
  empty: {
    color: '#64748b',
    fontSize: 14,
  },
  itemBox: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  itemMeta: {
    fontSize: 13,
    color: '#475569',
  },
  deleteButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    marginTop: 4,
  },
  deleteText: {
    color: '#b91c1c',
    fontWeight: '700',
  },
});
