import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { createStyles } from './styles';

export default function App() {
  const [meals, setMeals] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const styles = createStyles(isDarkMode);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addMeal = (food, calories) => {
    const newMeal = {
      id: Date.now().toString(),
      food,
      calories: parseInt(calories),
    };
    setMeals([...meals, newMeal]);
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);  return (
    <SafeAreaView style={styles.container}>
      <MealInput onAddMeal={addMeal} styles={styles} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <TotalCalories total={totalCalories} styles={styles} />
      <MealList meals={meals} styles={styles} />
    </SafeAreaView>
  );
}

function MealInput({ onAddMeal, styles, toggleDarkMode, isDarkMode }) {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');

  const handleSubmit = () => {
    if (!food || !calories) return;
    onAddMeal(food, calories);
    setFood('');
    setCalories('');
  };

  return (
    <View>
      <Text style={styles.header}>calio</Text>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleDarkMode}>
        <View style={styles.toggleButtonInner} />
      </TouchableOpacity>
      <TextInput
        placeholder="food name"
        placeholderTextColor={styles.input.color}
        value={food}
        onChangeText={setFood}
        style={styles.input}
      />
      <TextInput
        placeholder="calories"
        placeholderTextColor={styles.input.color}
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
        style={styles.input}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>add meal</Text>
      </TouchableOpacity>
    </View>
  );
}

function TotalCalories({ total, styles }) {
  return <Text style={styles.total}>total: {total} kcal</Text>;
}

function MealList({ meals, styles }) {
  return (
    <FlatList
      data={meals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Text style={styles.mealItem}>
          {item.food} - {item.calories} kcal
        </Text>
      )}    />
  );
}
