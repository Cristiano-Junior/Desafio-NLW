import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar'
import { ImageBackground, Text, View, TouchableOpacity } from 'react-native'
import { styled } from 'nativewind'
import { api } from '../src/lib/api'
import * as SecureStore from 'expo-secure-store';
import { useRouter } from "expo-router";

import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'
import NLWlogo from '../src/assets/nlw-spacetime-logo.svg'
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/6cce7529d0c46f851bb3',
};


export default function App() {

  const router = useRouter();

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold
  })

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '6cce7529d0c46f851bb3',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime'
      }),
    },
    discovery
  );

  const Styledstripes = styled(Stripes)

  async function handleGithubOAuthCode(code: string) {

    const response = await api.post('/register', {
        code,
      })

      const { token } = response.data
        
      await SecureStore.setItemAsync('token', token)

      router.push('memories')
  }


  useEffect(() => {

    // console.log(makeRedirectUri({
    //   scheme: 'nlwspacetime'
    // }))
  
    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOAuthCode(code)

    }
  }, [response]);

  if (!hasLoadedFonts) {
    return null
  }

  return (
    <ImageBackground
      source={blurBg}
      className='bg-gray-900 px-8 py-10 flex-1 items-center relative'
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <Styledstripes className='absolute left-2' />

      <View className="flex-1 items-center justify-center gap-6">
        <NLWlogo />
        
        <View className='space-y-2'>
          <Text className='text-center font-title text-2xl leading-tight text-gray-50'>
            Sua cápsula do tempo
          </Text>
          <Text className='text-center font-body text-base leading-relaxed text-gray-100'>
            Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity 
          activeOpacity={0.7}
          className='rounded-full bg-green-500 px-5 py-3'
          onPress={() => signInWithGithub()}
        >
          <Text className='font-alt text-sm uppercase text-black'>Cadastrar Lembranças</Text>

        </TouchableOpacity>

      </View>

      <Text className='text-center font-body text-sm leading-relaxed text-gray-200'>Feito com 💜 no NLW da Rocketseat</Text>

      <StatusBar style="light" translucent />
    </ImageBackground>
  );
}
