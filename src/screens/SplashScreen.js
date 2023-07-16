import React, { useEffect, useState } from 'react'
import { View, Text, ImageBackground, Image } from 'react-native'
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
      <View style={{ borderRadius: 30, }}>
        <Image source={require('../images/AppImage.jpeg')} style={{ width: 160, height: 160, borderRadius: 20 }} />
      </View>
      {/* <ImageBackground source={require('../images/AppImage.jpeg')} style={{ width: '100%', height: '100%' }} resizeMode='stretch' /> */}
    </View>
  )
}

export default index