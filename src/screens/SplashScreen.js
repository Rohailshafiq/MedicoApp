import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { useAppState } from '../Context/AppContext'


const index = (props) => {
  const { dispatch, userStateConfig } = useAppState();

  useEffect(() => {
    if (userStateConfig.user) {
      dispatch('LOADER_OFF');
    }
  }, [userStateConfig.user])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Loading.....</Text>
    </View>
  )
}

export default index