# React Native Interview Q&A — Todo App Build

---

## Step 1: Project Setup

### Q1: What is the React Native Bridge? How does React Native render native UI components?

**Polished Answer:**
In the old architecture, React Native used an asynchronous Bridge that serialized all communication between the JS thread and the Native thread as JSON. This created a bottleneck — especially for animations and gestures.

The New Architecture replaces this with three key pieces:
- **JSI (JavaScript Interface)** — a C++ layer that lets JS hold direct references to native objects, eliminating JSON serialization.
- **Fabric** — the new rendering system that uses JSI for synchronous UI updates.
- **TurboModules** — replace Native Modules with lazy-loaded, direct native function calls through JSI.

**Key terms to mention:** JSI, Fabric, TurboModules, asynchronous bridge, JSON serialization bottleneck.

---

## Step 2: Your First Component

### Q1: Why must all text in React Native be inside a `<Text>` component? What happens if it's not?

**Polished Answer:**
In React Native, unlike web browsers, there's no implicit text rendering. On the web, a `<div>` can contain raw text because the browser's DOM handles it. But React Native maps components to native views — and native platforms (iOS/Android) require a dedicated text element (`UILabel` on iOS, `TextView` on Android) to render text.

A `<View>` maps to a native container (`UIView` / `android.view.View`) that doesn't know how to display text. So if you put raw text inside a `<View>`, React Native throws:
`"Text strings must be rendered within a <Text> component."`

**Key terms to mention:** Native view mapping, UILabel (iOS), TextView (Android), no implicit text rendering.

---

## Step 3: Learn useState

### Q1: What is "state" in React/React Native? Why does calling the setter trigger a re-render?

**Polished Answer:**
State is React's mechanism for preserving data between renders and triggering UI updates. Unlike regular variables which get reset every time the component function re-executes, `useState` stores the value in React's internal fiber tree — so it persists across renders.

Why not a regular variable? Every time a component re-renders, the function runs again from the top. A `let todos = []` would reset to empty on every render. `useState` holds the value outside the function scope.

When you call the setter function (e.g., `setTodos`), React schedules a re-render, runs the component function again, and the reconciliation algorithm diffs the old and new virtual trees to determine the minimal set of native UI updates needed.

**Key terms to mention:** Persists across renders, fiber tree, reconciliation, scheduled re-render, minimal UI updates, state stored outside function scope.

---

## Step 4: Build the Input (Controlled TextInput)

### Q1: How does `onChangeText` differ from web React's `onChange`? What is a "controlled component"?

**Polished Answer:**
Web React's `onChange` gives you an event object — you extract the value with `e.target.value`. React Native's `onChangeText` gives you the string directly — no event object needed.

A controlled component is one where React state is the **single source of truth** for the input's value. The component doesn't manage its own internal state — instead, we bind `value` to a state variable and update that state via `onChangeText`.

The flow: user types → `onChangeText` fires → `setInputValue` called → React re-renders → TextInput displays the new value from state.

The formula: `value={state}` + `onChangeText={setState}` = controlled component.

The opposite is an **uncontrolled component** — where the input manages its own value internally and you read it using a `ref`. Controlled components are preferred because you have full control over the data (validation, transformation, blocking input).

**Key terms to mention:** Single source of truth, controlled vs uncontrolled, event object vs direct string, ref for uncontrolled.

---

## Step 5: Add Todos (onPress + Spread Operator)

### Q1: Why `[...todos, newTodo]` instead of `todos.push(newTodo)`? Why is immutability critical?

**Polished Answer:**
React uses referential equality (`===`) to determine if state has changed. `todos.push()` mutates the existing array — the reference stays the same. So when you pass it to `setTodos`, React compares old and new references, sees they're identical, and skips the re-render. The UI never updates.

The spread operator `[...todos, newTodo]` creates a new array with a new memory reference. React detects the change and triggers a re-render. This is why immutability is fundamental to React's rendering model — it relies on reference comparison, not deep equality checks, for performance.

**Key terms to mention:** Referential equality, new reference, shallow comparison, re-render skipped, immutable state updates.

---

## Step 6: Display the List with FlatList

### Concept: FlatList Behavior & Props

**What is FlatList?**
FlatList is a virtualized list — it only renders items visible on screen plus a small buffer. As you scroll, it recycles off-screen views and fills them with new data. Like a conveyor belt at a sushi restaurant — you only see the plates in front of you.

**3 Required Props:**
```jsx
<FlatList
  data={todos}                          // The array to display
  renderItem={renderTodo}               // Function returning JSX for each item
  keyExtractor={(item) => item.id}      // Returns unique STRING per item
/>
```

- `data` — the array FlatList loops through
- `renderItem` — receives `{ item, index }`, returns JSX for each row
- `keyExtractor` — returns a unique string for React's reconciliation (must be a string!)

**Other Useful Props (interview gold):**
| Prop | What it does |
|------|-------------|
| `ListEmptyComponent` | Shows when array is empty |
| `ListHeaderComponent` | Renders above the list |
| `ListFooterComponent` | Renders below the list |
| `ItemSeparatorComponent` | Renders between items |
| `onRefresh` + `refreshing` | Pull-to-refresh |
| `onEndReached` | Fires near bottom (infinite scroll) |
| `horizontal` | Horizontal scrolling |
| `numColumns` | Grid layout |

**FlatList vs ScrollView vs SectionList:**
| Use case | Component |
|----------|-----------|
| Short list (< 20 items) | ScrollView + .map() is fine |
| Long list | **FlatList** (virtualized) |
| Grouped data (contacts A-Z) | **SectionList** (FlatList with section headers) |

**Why interviewers love this:**
FlatList shows you understand mobile performance. On web, the browser handles scrolling. On mobile, rendering 1,000 views crashes the app. Knowing FlatList = thinking about mobile constraints.

**Key terms to mention:** Virtualized list, recycling, only renders visible items, reconciliation, keyExtractor must return string, ScrollView for short lists, SectionList for grouped data.

### Q1: Why FlatList over ScrollView + .map()? What is virtualization? When use SectionList?

**Polished Answer:**
FlatList is a virtualized list — it only renders items visible on screen plus a small buffer, and recycles off-screen views as you scroll. ScrollView with .map() renders every item in memory at once, which is fine for small lists but causes performance issues and memory pressure with large datasets.

SectionList is used when data is grouped into categories with headers — like contacts organized alphabetically or settings grouped by category. It takes `sections` instead of `data`, where each section has a `title` and `data` array. It's essentially FlatList with built-in section header support.

**Key terms to mention:** Virtualization, view recycling, memory pressure, SectionList for grouped data with headers.

---

## Step 7: Delete Todos (.filter)

### Q1: Why `onPress={() => deleteTodo(id)}` instead of `onPress={deleteTodo(id)}`?

**Polished Answer:**
`onPress={deleteTodo(item.id)}` calls the function immediately during render — the parentheses invoke it right away. This causes an infinite loop: render → delete → state changes → re-render → delete again.

`onPress={() => deleteTodo(item.id)}` wraps it in an arrow function, creating a callback that only executes when the press event occurs.

Rule of thumb: if you need to pass arguments → use an arrow function wrapper. If no arguments → pass the function reference directly (e.g., `onPress={addTodo}`).

**Key terms to mention:** Function reference vs function invocation, callback, infinite render loop, arrow function wrapper.

---

## Step 8: Toggle Complete

### Q1: How do you update one item in an array without mutating state? Walk through the .map() approach.

**Polished Answer:**
Use `.map()` to iterate over every item. For each item, check if its `id` matches the target. If it matches, use the spread operator `{ ...todo, completed: !todo.completed }` to create a new object with all existing properties plus the updated field. If it doesn't match, return the original item unchanged.

```jsx
setTodos(todos.map(todo =>
  todo.id === id
    ? { ...todo, completed: !todo.completed }  // match → new object
    : todo                                       // no match → same object
));
```

Three key points: (1) `.map()` returns a new array — immutability preserved. (2) Ternary to target one item — `id === id ? modify : pass through`. (3) Spread operator `{ ...todo, field: newValue }` creates a new object without mutating the original.

**Key terms to mention:** Immutable update, spread operator, ternary pattern, new array reference, single-item update.

---

## Step 9: Handle Submit Key (onSubmitEditing)

### Q1: Name 3 TextInput props specific to React Native that don't exist in web React. What does `returnKeyType` do?

**Polished Answer:**
Three RN-only TextInput props: `onSubmitEditing` — fires when the user presses the keyboard's return key, similar to detecting Enter on web. `returnKeyType` — changes the label on the keyboard's return key to options like "done", "go", "search", "send", or "next", giving the user context about the action. `blurOnSubmit` — controls whether the input loses focus after submit.

Other RN-only props worth mentioning: `autoCorrect`, `autoCapitalize`, `secureTextEntry` (for passwords), `keyboardType` (numeric/email/phone keyboards), `textContentType` (iOS autofill hints).

**Key terms to mention:** onSubmitEditing, returnKeyType, blurOnSubmit, keyboardType, secureTextEntry, mobile-specific UX.

---

## Step 10: Empty State (Conditional Rendering)

### Q1: What is `ListEmptyComponent` in FlatList? Why prefer it over a ternary?

**Polished Answer:**
`ListEmptyComponent` is a FlatList prop that automatically renders when the `data` array is empty. Preferred over a ternary for two reasons: (1) **Encapsulation** — the empty state logic lives inside FlatList, keeping it as a single self-contained component. (2) **Preserves mounting** — a ternary like `{empty ? <Empty /> : <FlatList />}` unmounts and remounts FlatList entirely, losing scroll position and internal state. `ListEmptyComponent` keeps FlatList mounted and simply swaps content.

Same pattern applies to `ListHeaderComponent`, `ListFooterComponent`, and `ItemSeparatorComponent` — FlatList is designed to be a one-stop shop for list UI.

**Key terms to mention:** Encapsulation, mount/unmount preservation, self-contained component, FlatList built-in props.

---

## Step 11: Pull-to-Refresh + List Header

### Q1: Name 5 useful FlatList props beyond `data`, `renderItem`, and `keyExtractor`. Why is FlatList important in interviews?

**Polished Answer:**
Five useful FlatList props: (1) `ListEmptyComponent` — renders when data is empty. (2) `ListHeaderComponent` — renders above the list. (3) `ListFooterComponent` — renders below the list. (4) `onRefresh` + `refreshing` — built-in pull-to-refresh. (5) `onEndReached` — fires near the bottom for infinite scroll/pagination.

Others worth mentioning: `ItemSeparatorComponent`, `horizontal`, `numColumns`, `initialNumToRender`, `maxToRenderPerBatch`.

FlatList matters in interviews because it proves you understand mobile performance constraints. Unlike web where the browser handles scrolling, mobile apps crash if you render thousands of views. FlatList's virtualization — rendering only visible items and recycling off-screen views — is the cornerstone of performant RN lists.

**Key terms to mention:** Virtualization, view recycling, built-in pull-to-refresh, infinite scroll, performance optimization, mobile constraints.

---

## Step 12: Final Review — Mock Interview (10 Questions)

### Concepts You Learned Building This App
- React Native components: View, Text, SafeAreaView, TextInput, TouchableOpacity, FlatList
- useState hook for state management
- Controlled components (value + onChangeText)
- Immutable state updates: spread operator, .filter(), .map()
- FlatList: virtualization, keyExtractor, ListEmptyComponent, ListHeaderComponent, pull-to-refresh
- Mobile-specific: Keyboard.dismiss(), onSubmitEditing, returnKeyType, blurOnSubmit
- Conditional rendering: ternary, logical AND, style arrays
- StyleSheet.create() — no CSS files, no className, unitless numbers

---

### Q1: What is React Native and how does it differ from React web?

**Polished Answer:**
React Native is a framework for building native mobile apps using JavaScript and React. Unlike React web which renders to the DOM (HTML elements like div, span, p), React Native renders to actual native UI components — UIView and UILabel on iOS, android.view.View and TextView on Android. The code is JavaScript, but the output is a real native app, not a web view or hybrid app.

Key differences: View instead of div, Text instead of p/span, StyleSheet instead of CSS, FlatList instead of .map(), onPress instead of onClick, onChangeText gives string directly instead of event object, flexDirection defaults to 'column' not 'row'.

---

### Q2: Explain the React Native Bridge architecture. (Mention New Architecture / JSI if possible)

**Polished Answer:**
In the old architecture, React Native used an asynchronous Bridge that serialized all communication between the JS thread and the Native thread as JSON. This created a bottleneck — especially for animations and gestures.

The New Architecture replaces this with: **JSI (JavaScript Interface)** — a C++ layer that lets JS hold direct references to native objects, eliminating JSON serialization. **Fabric** — the new rendering system using JSI for synchronous UI updates. **TurboModules** — lazy-loaded native modules with direct JS-to-native calls through JSI.

---

### Q3: What is state? What happens when you call setState?

**Polished Answer:**
State is React's mechanism for preserving data between renders and triggering UI updates. Unlike regular variables which reset every time the component function re-executes, useState stores the value in React's internal fiber tree.

When you call the setter (e.g., setTodos), React schedules a re-render. It runs the component function again, and the reconciliation algorithm diffs the old and new virtual trees to determine the minimal set of native UI updates needed. State updates are batched for performance — multiple setState calls in the same event handler result in a single re-render.

---

### Q4: FlatList vs ScrollView — when do you use each? What is virtualization?

**Polished Answer:**
FlatList is a virtualized list — it only renders items visible on screen plus a small buffer, and recycles off-screen views as you scroll. Use it for long or dynamic lists. ScrollView renders all children at once — fine for short, static content (< 20 items) but causes memory issues with large datasets.

Virtualization means only creating native views for what's visible, not for every item in the data array. FlatList also provides built-in pull-to-refresh, infinite scroll (onEndReached), headers, footers, separators, and empty states. SectionList extends this for grouped data with section headers.

---

### Q5: How does styling work in React Native? How is it different from CSS?

**Polished Answer:**
React Native uses StyleSheet.create({}) and JavaScript objects instead of CSS files. Key differences: no class selectors or cascading — styles are applied directly via the style prop. Units are unitless density-independent pixels (no px/rem/em). Flexbox is the layout system with flexDirection defaulting to 'column' (opposite of web's 'row'). No CSS grid. Multiple styles are applied via arrays: style={[styles.a, styles.b]}.

Some CSS properties have different names: backgroundColor (not background-color), borderRadius (camelCase). Some don't exist: no box-shadow on Android (use elevation instead). Shadow props differ between iOS (shadowColor, shadowOffset, shadowOpacity, shadowRadius) and Android (elevation).

---

### Q6: What are controlled components?

**Polished Answer:**
A controlled component is one where React state is the single source of truth for the input's value. You bind the value prop to state and update that state via onChangeText. The flow: user types → onChangeText fires → setState called → React re-renders → input displays new value from state.

Formula: value={state} + onChangeText={setState} = controlled component.

The opposite is an uncontrolled component where the input manages its own value and you read it via a ref. Controlled components are preferred because you have full control over the data — validation, transformation, blocking input.

---

### Q7: Why must state updates be immutable in React / React Native?

**Polished Answer:**
React uses referential equality (===) to determine if state has changed. If you mutate the existing array with push() or modify an object property directly, the reference stays the same. React compares old and new references, sees they're identical, and skips the re-render — the UI never updates.

Immutable updates with the spread operator ([...array, newItem] or {...obj, key: newValue}) create new references. React detects the change and triggers a re-render. Three patterns: spread for adding, .filter() for removing, .map() with spread for updating one item.

---

### Q8: What is the difference between props and state?

**Polished Answer:**
State is internal data managed by the component itself — it can change over time via setter functions and triggers re-renders. Props are external data passed from a parent component — they are read-only and the child cannot modify them.

Analogy: props are like function arguments, state is like local variables. When a parent's state changes and is passed as props, the child re-renders with the new props. In our todo app, the App component owns the todos state. If we extracted TodoItem into a separate component, the todo data would be passed as props and the delete/toggle handlers would also be passed as props (callbacks).

---

### Q9: Explain the component lifecycle (mount, update, unmount). How do hooks relate?

**Polished Answer:**
Mount: component is created and inserted into the UI tree. Update: component re-renders due to state or prop changes. Unmount: component is removed from the UI tree.

With hooks: useEffect(() => { ... }, []) with an empty dependency array runs on mount. useEffect(() => { ... }, [dep]) runs when dep changes (update). useEffect(() => { return () => cleanup }, []) — the cleanup function runs on unmount.

In class components these were componentDidMount, componentDidUpdate, componentWillUnmount. Hooks unified these into a single useEffect API. In our todo app, if we wanted to persist todos to AsyncStorage, we'd use useEffect to save whenever todos changes and load on mount.

---

### Q10: Walk me through the full flow: user types a todo, presses Add — what happens from start to finish?

**Polished Answer:**
1. User taps TextInput — keyboard appears (mobile-specific)
2. User types "Buy groceries" — each keystroke fires onChangeText, which calls setInputValue with the new string. React re-renders, TextInput shows updated value (controlled component)
3. User presses the "+" button — onPress fires, calling addTodo()
4. addTodo() runs: guard clause checks input isn't empty, creates new todo object {id: Date.now().toString(), text: "Buy groceries", completed: false}
5. setTodos([...todos, newTodo]) — spread operator creates a NEW array with the new todo appended. New reference triggers React re-render
6. setInputValue('') — clears the input for next entry
7. Keyboard.dismiss() — hides the soft keyboard (mobile-specific)
8. React's reconciliation diffs the virtual tree — detects todos array changed
9. FlatList receives new data prop, calls renderItem for the new item
10. FlatList's keyExtractor uses item.id to track the new item
11. Native UI updates — a new native View with Text appears in the list
12. Counter badge updates from todos.length showing the new count

---

## Your Progress Summary

| Step | Concept | Status |
|------|---------|--------|
| 1 | Project Setup / Expo | Done |
| 2 | Components: View, Text, SafeAreaView | Done |
| 3 | useState | Done |
| 4 | Controlled TextInput | Done |
| 5 | addTodo / Spread Operator / Keyboard.dismiss | Done |
| 6 | FlatList (virtualized list) | Done |
| 7 | deleteTodo / .filter() | Done |
| 8 | toggleTodo / .map() with spread | Done |
| 9 | onSubmitEditing / returnKeyType | Done |
| 10 | ListEmptyComponent / Conditional Rendering | Done |
| 11 | Pull-to-refresh / ListHeaderComponent | Done |
| 12 | Final Review + Mock Interview | Done |
