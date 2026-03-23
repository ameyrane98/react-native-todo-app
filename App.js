import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  FlatList,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  function addTodo() {
    if (inputValue.trim() === '') return;
    setTodos([...todos, { id: Date.now().toString(), text: inputValue.trim(), completed: false }]);
    setInputValue('');
    Keyboard.dismiss();
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function toggleTodo(id) {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  }

  function onRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      setTodos(todos.filter(todo => !todo.completed));
      setRefreshing(false);
    }, 800);
  }

  function renderTodo({ item }) {
    return (
      <TouchableOpacity
        style={[styles.todoItem, item.completed && styles.todoItemCompleted]}
        activeOpacity={0.7}
        onPress={() => toggleTodo(item.id)}
      >
        <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <View style={styles.todoTextContainer}>
          <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
            {item.text}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.7}
          onPress={() => deleteTodo(item.id)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>My Todos</Text>
        <View style={styles.counterRow}>
          <Text style={styles.subtitle}>Stay organized, stay productive</Text>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{todos.length}</Text>
          </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#6b6b8d"
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={addTodo}
          returnKeyType="done"
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.7}
          onPress={addTodo}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={[
          styles.listContent,
          todos.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={todos.length > 0 && (
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              {todos.filter(t => t.completed).length} of {todos.length} completed
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyTitle}>No todos yet</Text>
            <Text style={styles.emptySubtitle}>Add your first task above!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#16213e',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e94560',
    letterSpacing: 1,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#a3a3c2',
    letterSpacing: 0.5,
  },
  counterBadge: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 28,
    alignItems: 'center',
  },
  counterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  addButton: {
    backgroundColor: '#e94560',
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 30,
  },
  list: {
    flex: 1,
    marginTop: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  todoItem: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  todoItemCompleted: {
    opacity: 0.6,
    borderColor: '#1a3a2a',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4a4a6a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxChecked: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    color: '#e0e0f0',
    lineHeight: 22,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b6b8d',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: '700',
  },
  listContentEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e0e0f0',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6b6b8d',
    letterSpacing: 0.3,
  },
  listHeader: {
    paddingBottom: 12,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4a',
  },
  listHeaderText: {
    fontSize: 13,
    color: '#6b6b8d',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
