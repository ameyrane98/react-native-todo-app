# React Native Todo App

A polished, fully-featured Todo app built with React Native and Expo — designed as a hands-on learning project for React Native mobile developer interview prep.

## Features

- **Add todos** — type and press "+" or hit "Done" on the keyboard
- **Delete todos** — tap the "✕" button to remove
- **Toggle complete** — tap a todo to mark done (strikethrough + checkmark)
- **Pull-to-refresh** — pull down to clear all completed todos
- **Empty state** — beautiful placeholder when no todos exist
- **Live counter** — badge shows total todo count
- **Completion tracker** — header shows "X of Y completed"
- **Keyboard handling** — auto-dismiss, submit via keyboard, rapid entry mode

## React Native Concepts Covered

| Concept | Description |
|---------|-------------|
| `useState` | State management for todos, input value, refresh state |
| Controlled Components | TextInput with `value` + `onChangeText` binding |
| FlatList | Virtualized list with `renderItem`, `keyExtractor` |
| Immutable State Updates | Spread operator, `.filter()`, `.map()` |
| ListEmptyComponent | Built-in FlatList empty state |
| ListHeaderComponent | Completion summary above the list |
| Pull-to-Refresh | `refreshing` + `onRefresh` props on FlatList |
| Keyboard API | `Keyboard.dismiss()`, `onSubmitEditing`, `returnKeyType` |
| Conditional Rendering | Ternary, logical AND, style arrays |
| StyleSheet | `StyleSheet.create()`, shadows, rounded corners, flexbox |

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

Then:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on your phone

## Tech Stack

- **React Native** — mobile UI framework
- **Expo** — managed workflow for fast development
- **JavaScript** — no TypeScript, kept simple for learning

## Interview Study Guide

See [`INTERVIEW_QA.md`](./INTERVIEW_QA.md) for a complete set of React Native interview questions and polished answers covering every concept used in this app.

## Screenshots

The app features a dark theme with:
- Dark navy background (`#1a1a2e`)
- Accent red for buttons and highlights (`#e94560`)
- Green checkmarks for completed todos (`#2ecc71`)
- Rounded cards with shadows for each todo item
