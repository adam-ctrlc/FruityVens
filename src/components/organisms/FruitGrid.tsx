import React, { useState, useCallback, useMemo } from 'react';
import { FlatList, View, ListRenderItem } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/atoms';
import { FruitCard, SearchBar } from '@/components/molecules';
import { Fruit } from '@/types';

interface FruitGridProps {
  fruits: Fruit[];
  onFruitPress?: (fruit: Fruit) => void;
  onFruitEdit?: (fruit: Fruit) => void;
}

function FruitGrid({ fruits, onFruitPress, onFruitEdit }: FruitGridProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () => fruits.filter(f => f.name.toLowerCase().includes(search.toLowerCase())),
    [fruits, search],
  );

  const renderItem = useCallback<ListRenderItem<Fruit>>(({ item }) => (
    <FruitCard fruit={item} onPress={onFruitPress} onEdit={onFruitEdit} />
  ), [onFruitPress, onFruitEdit]);

  return (
    <View className="flex-1">
      <SearchBar value={search} onChangeText={setSearch} placeholder="Search fruits..." />
      {filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center py-16">
          <Ionicons name="leaf-outline" size={48} color="#9ca3af" />
          <ThemedText variant="muted" className="mt-2">No fruits found</ThemedText>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          numColumns={2}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

export default React.memo(FruitGrid);
