import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { createStyles } from './styles';
import Analytics from './Analytics';

export default function App() {
  const [meals, setMeals] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [calorieGoal, setCalorieGoal] = useState('');
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'analytics'

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

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const goalValue = parseInt(calorieGoal);
  const remainingCalories = goalValue ? goalValue - totalCalories : null;
  
  const navigateToPage = (page) => {
    setCurrentPage(page);
  };
  
  if (currentPage === 'analytics') {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigateToPage('home')}
        >
          <Text style={styles.navButtonText}>← home</Text>
        </TouchableOpacity>
        <Analytics meals={meals} styles={styles} isDarkMode={isDarkMode} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateToPage('analytics')}
          >
            <Text style={styles.navButtonText}>analytics →</Text>
          </TouchableOpacity>
          <MealInput 
            onAddMeal={addMeal} 
            styles={styles} 
            toggleDarkMode={toggleDarkMode} 
            isDarkMode={isDarkMode} 
          />
          <TotalCalories 
            total={totalCalories} 
            goal={calorieGoal} 
            remaining={remainingCalories} 
            onSetGoal={setCalorieGoal} 
            styles={styles} 
          />
          <MealList meals={meals} styles={styles} />
        </View>
      </TouchableWithoutFeedback>
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
      <Text style={styles.subtitle}>{`{cali /ˈka.li/ — adj. (from Greek καλή) beautiful}`}</Text>
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

function TotalCalories({ total, goal, remaining, onSetGoal, styles }) {
  return (
    <View>
      <TextInput
        placeholder="set daily goal (kcal)"
        placeholderTextColor={styles.goalInput.color}
        value={goal}
        onChangeText={onSetGoal}
        keyboardType="numeric"
        style={styles.goalInput}
      />
      <Text style={styles.total}>total: {total} kcal</Text>
      {goal !== '' && (
        <Text style={styles.total}>
          goal: {goal} kcal | remaining: {remaining} kcal
        </Text>
      )}
    </View>
  );
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
      )}
    />
  );
}
