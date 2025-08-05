import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  FlatListProps,
  View,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  ListRenderItemInfo,
  Text,
} from 'react-native';
import { performanceMonitor, memoryManager } from '../services/performanceService';

interface OptimizedFlatListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[];
  renderItem: (info: ListRenderItemInfo<T>) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  loading?: boolean;
  refreshing?: boolean;
  hasMore?: boolean;
  emptyComponent?: React.ReactElement;
  loadingComponent?: React.ReactElement;
  initialNumToRender?: number;
  maxToRenderPerBatch?: number;
  windowSize?: number;
  removeClippedSubviews?: boolean;
  getItemLayout?: (data: T[] | null, index: number) => {
    length: number;
    offset: number;
    index: number;
  };
}

const OptimizedFlatList = <T extends any>({
  data,
  renderItem,
  keyExtractor,
  onLoadMore,
  onRefresh,
  loading = false,
  refreshing = false,
  hasMore = false,
  emptyComponent,
  loadingComponent,
  initialNumToRender = 10,
  maxToRenderPerBatch = 10,
  windowSize = 10,
  removeClippedSubviews = true,
  getItemLayout,
  style,
  contentContainerStyle,
  ...props
}: OptimizedFlatListProps<T>) => {
  const flatListRef = useRef<FlatList<T>>(null);
  const [isEndReached, setIsEndReached] = useState(false);
  const [renderCount, setRenderCount] = useState(0);

  // Performance monitoring
  const startRenderTimer = useCallback(() => {
    performanceMonitor.startTimer('flatlist_render');
  }, []);

  const endRenderTimer = useCallback(() => {
    const renderTime = performanceMonitor.endTimer('flatlist_render');
    if (renderTime > 16) {
      console.warn(`Slow FlatList render: ${renderTime}ms`);
    }
  }, []);

  // Optimized render item with performance monitoring
  const optimizedRenderItem = useCallback(
    (info: ListRenderItemInfo<T>) => {
      startRenderTimer();
      const element = renderItem(info);
      endRenderTimer();
      return element;
    },
    [renderItem, startRenderTimer, endRenderTimer]
  );

  // Memoized key extractor
  const memoizedKeyExtractor = useCallback(
    (item: T, index: number) => keyExtractor(item, index),
    [keyExtractor]
  );

  // Handle end reached with debouncing
  const handleEndReached = useCallback(() => {
    if (!isEndReached && hasMore && !loading && onLoadMore) {
      setIsEndReached(true);
      onLoadMore();
      // Reset after a delay
      setTimeout(() => setIsEndReached(false), 1000);
    }
  }, [isEndReached, hasMore, loading, onLoadMore]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    }
  }, [onRefresh]);

  // Custom refresh control
  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
        colors={['#007AFF']}
        tintColor="#007AFF"
      />
    ),
    [refreshing, handleRefresh]
  );

  // Footer component for loading more
  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }, [hasMore]);

  // Empty component
  const renderEmpty = useCallback(() => {
    if (loading) {
      return loadingComponent || (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      );
    }
    
    return emptyComponent || (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz içerik yok</Text>
      </View>
    );
  }, [loading, loadingComponent, emptyComponent]);

  // Memory optimization
  const handleScrollBeginDrag = useCallback(() => {
    // Clear expired cache when user starts scrolling
    memoryManager.optimizeMemory();
  }, []);

  // Optimized props
  const optimizedProps = useMemo(() => ({
    initialNumToRender,
    maxToRenderPerBatch,
    windowSize,
    removeClippedSubviews,
    getItemLayout,
    updateCellsBatchingPeriod: 50,
    disableVirtualization: false,
    maintainVisibleContentPosition: {
      minIndexForVisible: 0,
    },
  }), [initialNumToRender, maxToRenderPerBatch, windowSize, removeClippedSubviews, getItemLayout]);

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      renderItem={optimizedRenderItem}
      keyExtractor={memoizedKeyExtractor}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.1}
      onScrollBeginDrag={handleScrollBeginDrag}
      refreshControl={refreshControl}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      style={[styles.container, style]}
      contentContainerStyle={[
        data.length === 0 && styles.emptyContentContainer,
        contentContainerStyle
      ]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...optimizedProps}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContentContainer: {
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});

export default OptimizedFlatList; 