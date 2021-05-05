import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PalettePreview from '../components/PalettePreview';

const Home = ({ navigation, route }) => {
  const newColorPalette = route?.params?.newColorPalette;
  const [palettes, setPalettes] = useState([]);
  const [isRefreshig, setIsRefreshig] = useState(false);
  const URL = 'https://color-palette-api.kadikraman.now.sh/palettes';
  const handleFetchPalettes = useCallback(async () => {
    const response = await fetch(URL);
    if (response.ok) {
      const data = await response.json();
      setPalettes(data);
    }
  }, []);

  useEffect(() => {
    handleFetchPalettes();
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshig(true);
    await handleFetchPalettes();
    setIsRefreshig(false);
  }, []);

  useEffect(() => {
    if (newColorPalette) {
      setPalettes((currentPalletes) => [newColorPalette, ...currentPalletes]);
    }
  }, [newColorPalette]);

  return (
    <FlatList
      style={styles.list}
      data={palettes}
      keyExtractor={(item) => item.paletteName}
      renderItem={({ item }) => (
        <PalettePreview
          onPress={() => navigation.push('ColorPalette', item)}
          palette={item}
        />
      )}
      refreshing={isRefreshig}
      onRefresh={handleRefresh}
      ListHeaderComponent={
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddNewPalette');
          }}
        >
          <Text style={styles.buttonText}>Add a color scheme</Text>
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'teal',
    marginBottom: 10,
  },
});

export default Home;
