import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [lastActionEqual, setLastActionEqual] = useState(false); // Track if '=' was pressed

  const handlePress = (value) => {
    setError(null); // Reset any error

    if (value === 'C') {
      setDisplay('0');
      setInput('');
      setLastActionEqual(false);
      return;
    }

    if (value === '=') {
      try {
        const sanitizedInput = input.replace(/[^0-9+\-*/.%√]/g, '');
        if (sanitizedInput.includes('/0')) {
          setDisplay('Error');
          setInput('');
          return;
        }
        const result = eval(sanitizedInput); // Evaluate safely
        setDisplay(result.toString());
        setInput(result.toString());
        setLastActionEqual(true); // Mark '=' as last action
      } catch {
        setDisplay('Error');
        setInput('');
        setError('Invalid input');
      }
      return;
    }

    if (lastActionEqual && !isNaN(value)) {
      // Clear display if a number is entered after '='
      setInput(value);
      setDisplay(value);
      setLastActionEqual(false); // Reset the flag
      return;
    }

    if (value === 'DEL') {
      const newInput = input.slice(0, -1); // Remove last character
      setInput(newInput);
      setDisplay(newInput || '0'); // Show '0' if no input
      setLastActionEqual(false); // Reset the flag
      return;
    }

    if (value === '%') {
      try {
        const result = eval(input) / 100;
        setDisplay(result.toString());
        setInput(result.toString());
        setLastActionEqual(true);
      } catch {
        setDisplay('Error');
        setInput('');
        setError('Invalid input');
      }
      return;
    }

    if (value === '√') {
      try {
        if (input === ''){
          setDisplay('error');
          setError('Invalid input');
          return;
        }
        const result = Math.sqrt(eval(input)); // Compute square root
        setDisplay(result.toString());
        setInput(result.toString());
        setLastActionEqual(true);
      } catch {
        setDisplay('Error');
        setInput('');
        setError('Invalid input');
      }
      return;
    }

    if (value === '.') {
      if (!input.endsWith('.') && !/\.\d*$/.test(input)) {
        setInput((prev) => prev + value);
        setDisplay((prev) => prev + value);
      }
      return;
    }

    if (input === '' && ['+', '-', '*', '/'].includes(value)) return; // Prevent starting with operator

    setInput((prev) => (prev === '0' ? value : prev + value));
    setDisplay((prev) => (prev === '0' ? value : prev + value));
    setLastActionEqual(false); // Reset the flag
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        <Text style={styles.screen} numberOfLines={1} ellipsizeMode="tail">
          {display}
        </Text>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
      <View style={styles.buttonContainer}>
  {[
    'C', '/', '*', 'DEL',
    '7', '8', '9', '-',
    '4', '5', '6', '+',
    '1', '2', '3', '√',
    '%', '0', '.', '=',
  ].map((button, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.button,
        // Apply numberButton style for number buttons
        !isNaN(button) && button !== '.' && button !== '=' ? styles.numberButton :
        // Apply operatorButton style for operator buttons (excluding '=')
        (['+', '-', '*', '/', '√', '%', 'C', 'DEL'].includes(button)) ? styles.operatorButton :
        // Apply equalsButton style for '=' button
        button === '=' ? styles.equalsButton :
        null,
      ]}
      onPress={() => handlePress(button.toString())}
    >
      <Text
        style={[
          styles.buttonText,
          // Apply text color based on the button type
          !isNaN(button) && button !== '.' && button !== '=' ? styles.numberButtonText :
          (['+', '-', '*', '/', '√', '%', 'C', 'DEL'].includes(button)) ? styles.operatorButtonText :
          button === '=' ? styles.equalsButtonText :
          null,
        ]}
      >
        {button}
      </Text>
    </TouchableOpacity>
  ))}
</View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#fafafa',
  },
  screenContainer: {
    flex: 0.5,
    backgroundColor: '#fafafa',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
  },
  screen: {
    fontSize: 40,
    color: 'black',
    textAlign: 'right',
  },
  error: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },  
  button: {
    width: '22%',
    marginVertical: 10,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  operatorButton: {
    backgroundColor: 'transparent',
  },
  operatorButtonText: {
    color: '#000080',  // blue text for operator buttons
  },
  numberButton: {
    backgroundColor: 'transparent',
  },
  numberButtonText: {
    color: '#000',  // Black text for number buttons
  },
  equalsButton: {
    backgroundColor: '#000080',
  },
  equalsButtonText: {
    color: 'white',  // White text for equals button
  },

});
