/**
 * PullToRefresh - Custom pull-to-refresh wrapper with voltage-themed indicator
 * Wraps FlatList/ScrollView content with custom refresh animation
 */

import React, { useState, useCallback } from 'react';
import { RefreshControl, StyleProp, ViewStyle } from 'react-native';
import { colors } from '@/theme';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: (refreshControl: React.ReactElement) => React.ReactNode;
  tintColor?: string;
}

function PullToRefresh({
  onRefresh,
  children,
  tintColor = colors.voltage,
}: PullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={tintColor}
      colors={[tintColor]}
      progressBackgroundColor={colors.background.secondary}
    />
  );

  return <>{children(refreshControl)}</>;
}

export default React.memo(PullToRefresh);
