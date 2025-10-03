/**
 * @format
 */

import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();
import {AppRegistry} from 'react-native';
import App from './App';
import AppWithProviders from './AppWithProviders'
import {name as appName} from './app.json';
import { MetaMaskProvider,SDKConfigProvider } from '@metamask/sdk-react-native';

const sdkOptions = {
  dappMetadata: {
    name: 'Ecostep',
    url: 'https://ecostep.com',
    iconUrl: 'https://github.com/praxjt/stockwatch/blob/aa12d251c9c076c2d39e724286682e1a2b1aaa37/icons/CdxTradeLeafLogoresized.jpg?raw=true',

    scheme: 'ecostep',
  },

  // infuraAPIKey: '4d28bbb60153428faa503e499d7d8e59', 
};

const Root = () => (
  <SDKConfigProvider initialInfuraKey={'4d28bbb60153428faa503e499d7d8e59'}>
  <MetaMaskProvider sdkOptions={sdkOptions}>
   
        <AppWithProviders />

  </MetaMaskProvider>
  </SDKConfigProvider>
);
AppRegistry.registerComponent(appName, () => Root);
