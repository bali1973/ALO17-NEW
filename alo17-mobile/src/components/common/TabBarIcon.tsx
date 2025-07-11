import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

interface TabBarIconProps {
  route: string;
  focused: boolean;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ route, focused, color, size }) => {
  let iconName: string;

  switch (route) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Search':
      iconName = focused ? 'search' : 'search-outline';
      break;
    case 'CreateListing':
      iconName = focused ? 'add-circle' : 'add-circle-outline';
      break;
    case 'Messages':
      iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
      break;
    case 'Profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    default:
      iconName = 'help-outline';
  }

  return <Icon name={iconName} size={size} color={color} />;
};

export default TabBarIcon; 