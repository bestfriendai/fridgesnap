import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { fontSize, spacing } from '../../src/theme';
import { useThemeColors } from '../../src/contexts/ThemeContext';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: { [key: string]: string } = {
    index: '🧊',
    recipes: '📖',
    saved: '❤️',
    settings: '⚙️',
  };

  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
        {icons[name] || '•'}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray400,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: spacing.xs,
          height: 85,
        },
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          fontSize: fontSize.title,
          fontWeight: '700',
          color: colors.text,
          paddingLeft: spacing.lg,
        },
        headerTitleAlign: 'left',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'My Fridge',
          tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
          headerTitle: 'Fridgio',
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ focused }) => <TabIcon name="recipes" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ focused }) => <TabIcon name="saved" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: fontSize.caption,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabIconFocused: {
    opacity: 1,
  },
});
