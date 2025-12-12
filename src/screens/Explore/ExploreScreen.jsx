import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, RefreshControl} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Toast} from '../../../components/toast/Toast';
import {useToast} from '../../../components/toast/context/ToastContext';
import ecostep from '../../../contracts/ecostep.json';
import {BrowserProvider, ethers} from 'ethers';
// console.log("last",BrowserProvider,ethers)

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '../../../components/card'; // make sure your export is correct
import {useConnection} from '../../contexts/ConnectionContext'; // if using
import {ExpandableButton} from '../../../components/button/ExpandableButton';
import { useSDK } from '@metamask/sdk-react-native';
import { baseurl } from '../baseurl';

console.log('ExpandableButton', ExpandableButton);
const ExploreScreen = () => {
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const {accessToken, wallet} = useConnection();
  const [loadingIds, setLoadingIds] = useState([]);
  const toast = useToast();
  const {  connecting, chainId} =useConnection();
  const {sdk,provider,connected,account} =useSDK()
  //  console.log("provider",provider,"SDK",sdk,"connected",connected,"account",account,"chainId",chainId,"account",account)

  const fetchAllEvents = async () => {
    try {
      const res = await fetch(`${baseurl}/events/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-user-address': wallet,
        },
      });
      const data = await res.json();
      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch (err) {
      console.log('Fetch events error:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllEvents();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const getClaimSignature = async contractEventId => {
    const res = await fetch(`${baseurl}/events/claim-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-user-address': wallet,
      },
      body: JSON.stringify({contractEventId}),
    });

    const data = await res.json();
    return data; // { signature, participantCO2 }
  };
  const CONTRACT_ADDRESS = '0xFEFcabF690D9e72d37aa0c6C66FC748Ce0Cb9ecD';
  const CONTRACT_ADDRESS_2 = '0x2C9f25866946837C3D91ceDafA8DFAD973b716d2';
  const CONTRACT_ADDRESS_3 = '0x36d597d3FD6CB2cD8592841545C35248305A85e0';

  const handleClaimReward = async item => {
    if (!connected || !account || !provider) {
      toast.show('Please connect your wallet first', {
        type: 'error',
        duration: 4000,
        position: 'bottom',
      });
      return;
    }
    let isLoadingSet = false;
    if (!provider) {
      toast.show('Please connect your wallet first', {
        type: 'error',
        duration: 4000,
        position: 'bottom',
      });
      return;
    }

    try {
      setLoadingIds(prev => [...prev, item.id]);
      isLoadingSet = true;

      const res = await getClaimSignature(item.contractEventId);
      if (res.error) {
        toast.show(res.error, {
          type: 'error',
          duration: 4000,
          position: 'bottom',
        });
        return;
      }

      const {signature, participantCO2} = res;
      console.log('signature', signature, 'participantCO2', participantCO2);
      console.log(
        'CONTRACT_ADDRESS type:',
        typeof CONTRACT_ADDRESS_3,
        CONTRACT_ADDRESS_3,
      );

      if (!signature) {
        toast.show('Signature error ', {type: 'error'});
        return;
      }

      const iface = new ethers.Interface(ecostep.abi);
      console.log('iface', iface);
      const data = iface.encodeFunctionData('claim', [
        item.contractEventId,
        20,
        signature,
      ]);
      console.log('data', data);
      const from = await provider.getSelectedAddress();
      console.log('from', from);

      const txParams = {
        from,
        to: CONTRACT_ADDRESS_3,
        value: '0x0',
        data,
        gas: '0x493E0',
      };

      try {
        const txHash = await provider.request({
          method: 'eth_sendTransaction',
          params: [txParams],
        });
        console.log('Transaction hash:', txHash);
      } catch (err) {
        console.log('ESTIMATE REVERT:', err?.data?.message || err?.message);
        return; // stop here so we don't waste gas
      }

      const verifyRes = await verifyClaimOnBackend(item.contractEventId);
      console.log('item.contractEventId', item.contractEventId);
      connsole.log("verifyres",verifyRes)
      if (verifyRes.success) {
        toast.show('success!', {
          type: 'success',
          duration: 3500,
          position: 'bottom',
        });
      } else {
        toast.show('Try again later.', {
          type: 'error',
          duration: 4000,
          position: 'bottom',
        });
      }
    } catch (err) {
      console.log('err', err);
      console.log('RPC FAIL:', err?.data?.message || err?.message || err);

      toast.show('Try again.', {
        type: 'error',
        duration: 4000,
        position: 'bottom',
      });
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== item.id));
    }
  };
  const verifyClaimOnBackend = async contractEventId => {
    try {
      const res = await fetch(`$${baseurl}/events/verify-claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-user-address': wallet,
        },
        body: JSON.stringify({contractEventId}),
      });
      const data = await res.json();
      console.log('res', data);

      return data;
    } catch (err) {
      console.log('Verify claim error:', err);
      return {success: false, message: 'Failed to verify claim'};
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{padding: 16}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>Events</Text>

      {events.length === 0 && (
        <Text style={styles.noEvents}>No events found</Text>
      )}

      {events.map(item => (
        <Card key={item.id} variant="elevated" size="md" style={styles.card}>
          <CardHeader spacing="md">
            <View style={styles.headerRow}>
              <CardTitle style={styles.cardTitle}>{item.nameofevent}</CardTitle>
            </View>

            <Text
              style={[
                styles.statusText,
                item.status === 'claimed' && {
                  backgroundColor: '#4bff01',
                  color: '#000',
                },
              ]}>
              {item.status}
            </Text>
          </CardHeader>

          <CardContent>
            {/* Amount Invested */}
            <View style={styles.row}>
              <MaterialIcons
                name="moving"
                size={18}
                color="green"
                style={[styles.iconBox, {borderColor: 'green'}]}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '90%',
                }}>
                <Text style={styles.cardText}>Invested </Text>
                <Text Text style={styles.cardText}>
                  {item.AmountPaid} MATIC
                </Text>
              </View>
            </View>

            {/* Target CO2 Offset */}
            <View style={styles.row}>
              <MaterialIcons
                name="co2"
                size={18}
                color="#60a5fa"
                style={[styles.iconBox, {borderColor: '#60a5fa'}]}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '90%',
                }}>
                <Text style={styles.cardText}>Target to Offset</Text>
                <Text style={styles.cardText}>{item.TargetToOffset} KGCO2</Text>
              </View>
            </View>

            {/* Company */}
            <View style={styles.row}>
              <MaterialIcons
                name="business"
                size={18}
                color="#facc15"
                style={[styles.iconBox, {borderColor: '#facc15'}]}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '90%',
                }}>
                <Text style={styles.cardText}>Company </Text>
                <Text style={styles.cardText}>
                  {item.investor?.nameofcompany || 'N/A'}
                </Text>
              </View>
            </View>

            {/* Date */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 12,
              }}>
              <MaterialIcons
                name="calendar-month"
                size={18}
                color="#888"
                style={{marginRight: 6}}
              />
              <Text style={styles.date}>
                {new Date(item.createdAt).toDateString()}
              </Text>
            </View>

            {/* Claim Button */}
            <View style={{alignSelf: 'flex-end'}}>
              <ExpandableButton
                title="Claim Reward"
                isLoading={loadingIds.includes(item.id)}
                onPress={() => handleClaimReward(item)}
                backgroundColor="#4bff01"
                textColor="#000"
                fontSize={14}
                borderRadius={12}
                loadingIndicatorColor="#000"
                disabled={item.status === 'claimed'}
                style={{
                  marginTop: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              />
            </View>
          </CardContent>
        </Card>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 24,
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  noEvents: {
    color: '#71717a',
    textAlign: 'center',
    marginTop: 60,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  card: {
    marginBottom: 24,
    backgroundColor: '#0a0a0a',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    shadowColor: '#4bff01',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  statusText: {
    marginTop: 8,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#4bff01',
    color: '#4bff01',
    alignSelf: 'flex-start',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderColor: '#222',
    borderWidth: 1,
    // paddingBottom: 18,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#111',
  },
  iconBox: {
    padding: 4,
    borderWidth: 1,
    // borderColor: "#4bff01",
    borderRadius: 5,
    marginRight: 8,
  },
  cardText: {
    color: '#e4e4e7',
    fontSize: 15,
    fontWeight: '500',
  },
  date: {
    color: '#888',
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
export default ExploreScreen;
