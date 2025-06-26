import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function Analytics({ meals, styles, isDarkMode }) {
  // Calculate daily totals
  const getDailyTotals = () => {
    const dailyData = {};
    meals.forEach(meal => {
      const date = new Date(parseInt(meal.id)).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = 0;
      }
      dailyData[date] += meal.calories;
    });
    return dailyData;
  };

  // Get last 7 days of data
  const getWeeklyData = () => {
    const weeklyData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toDateString();
      
      const dailyTotal = getDailyTotals()[dateString] || 0;
      weeklyData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateString,
        calories: dailyTotal
      });
    }
    return weeklyData;
  };

  const dailyTotals = getDailyTotals();
  const weeklyData = getWeeklyData();
  const maxCalories = Math.max(...Object.values(dailyTotals), 1);
  const maxWeeklyCalories = Math.max(...weeklyData.map(d => d.calories), 1);

  // Simple bar chart component
  const BarChart = ({ data, title }) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.barContainer}>
          {Object.entries(data).slice(-7).map(([date, calories], index) => {
            const height = (calories / maxCalories) * 100;
            const displayDate = new Date(date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            });
            
            return (
              <View key={index} style={styles.barItem}>
                <View style={[styles.bar, { height: Math.max(height, 5) }]} />
                <Text style={styles.barLabel}>{displayDate}</Text>
                <Text style={styles.barValue}>{calories}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );

  // Simple line chart component
  const LineChart = ({ data, title }) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.lineContainer}>
        <View style={styles.lineChart}>
          {data.map((item, index) => {
            const height = (item.calories / maxWeeklyCalories) * 80;
            const left = (index / (data.length - 1)) * (width - 100);
            
            return (
              <View key={index}>
                <View 
                  style={[
                    styles.linePoint, 
                    { 
                      bottom: Math.max(height, 5),
                      left: left + 20
                    }
                  ]} 
                />
                {index < data.length - 1 && (
                  <View 
                    style={[
                      styles.lineSegment,
                      {
                        left: left + 25,
                        bottom: Math.max(height, 5) + 2.5,
                        width: (width - 100) / (data.length - 1) - 5,
                      }
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
        <View style={styles.lineLabels}>
          {data.map((item, index) => (
            <View key={index} style={styles.lineLabelItem}>
              <Text style={styles.lineLabel}>{item.day}</Text>
              <Text style={styles.lineValue}>{item.calories}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>analytics</Text>
      <Text style={styles.subtitle}>your calorie journey</Text>
      
      {Object.keys(dailyTotals).length > 0 ? (
        <>
          <BarChart data={dailyTotals} title="daily calories (last 7 days)" />
          <LineChart data={weeklyData} title="weekly trend" />
          
          <View style={styles.statsContainer}>
            <Text style={styles.statItem}>
              total meals logged: {meals.length}
            </Text>
            <Text style={styles.statItem}>
              average daily calories: {Math.round(Object.values(dailyTotals).reduce((a, b) => a + b, 0) / Math.max(Object.keys(dailyTotals).length, 1))}
            </Text>
            <Text style={styles.statItem}>
              highest day: {Math.max(...Object.values(dailyTotals))} kcal
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            no data yet. start logging meals to see your analytics.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
