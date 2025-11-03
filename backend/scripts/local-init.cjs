/* eslint @typescript-eslint/no-var-requires: "off" */
const { options } = require('@frequency-chain/api-augment');
const { WsProvider, ApiPromise, Keyring } = require('@polkadot/api');

// Given a list of events, a section and a method,
// returns the first event with matching section and method.
const eventWithSectionAndMethod = (events, section, method) => {
  const evt = events.find(({ event }) => event.section === section && event.method === method);
  return evt?.event;
};

const main = async () => {
  console.log('A quick script that will setup a clean localhost instance of Frequency for DSNP ');

  const providerUri = 'ws://127.0.0.1:9944';
  const provider = new WsProvider(providerUri);
  const api = await ApiPromise.create({
    provider,
    throwOnConnect: true,
    ...options,
  });
  await api.isReady;
  const keys = new Keyring().addFromUri('//Alice', {}, 'sr25519');

  // Create alice msa
  await new Promise((resolve, reject) => {
    console.log('Creating an MSA...');
    api.tx.msa.create().signAndSend(keys, {}, ({ status, events, dispatchError }) => {
      if (dispatchError) {
        const errorDetails = dispatchError.toHuman();
        console.log('Dispatch error details:', errorDetails);

        // Check if the error is MsaAlreadyExists (Module index 60, error 0x00000000)
        if (errorDetails.Module && errorDetails.Module.index === '60' && errorDetails.Module.error === '0x00000000') {
          console.log('INFO: MSA already exists for Alice, continuing...');
          resolve();
        } else {
          console.error('ERROR: ', errorDetails);
          reject();
        }
      } else if (status.isInBlock || status.isFinalized) {
        const evt = eventWithSectionAndMethod(events, 'msa', 'MsaCreated');
        if (evt) {
          const id = evt?.data[0];
          console.log('SUCCESS: MSA Created: ' + id);
          resolve();
        } else {
          console.log('INFO: MSA transaction completed (possibly already exists)');
          resolve();
        }
      }
    });
  });

  // Create alice provider
  await new Promise((resolve, reject) => {
    console.log('Creating a Provider...');
    api.tx.msa.createProvider('alice').signAndSend(keys, {}, ({ status, events, dispatchError }) => {
      if (dispatchError) {
        const errorDetails = dispatchError.toHuman();
        console.log('Provider creation error details:', errorDetails);

        // Check if it's a known "already exists" type error and continue
        if (errorDetails.Module && errorDetails.Module.index === '60') {
          console.log('INFO: Provider may already exist for Alice, continuing...');
          resolve();
        } else {
          console.error('ERROR: ', errorDetails);
          reject();
        }
      } else if (status.isInBlock || status.isFinalized) {
        const evt = eventWithSectionAndMethod(events, 'msa', 'ProviderCreated');
        if (evt) {
          const id = evt?.data[0];
          console.log('SUCCESS: Provider Created: ' + id);
          resolve();
        } else {
          console.log('INFO: Provider transaction completed (possibly already exists)');
          resolve();
        }
      }
    });
  });

  // Alice provider get Capacity
  await new Promise((resolve, reject) => {
    console.log('Staking for Capacity...');
    api.tx.capacity.stake('1', 500_000 * Math.pow(10, 8)).signAndSend(keys, {}, ({ status, events, dispatchError }) => {
      if (dispatchError) {
        console.error('ERROR: ', dispatchError.toHuman());
        reject();
      } else if (status.isInBlock || status.isFinalized) {
        const evt = eventWithSectionAndMethod(events, 'capacity', 'Staked');
        if (evt) {
          console.log('SUCCESS: Provider Staked:', evt.data.toHuman());
          resolve();
        } else {
          console.error(
            'ERROR: Expected event not found',
            events.map((x) => x.toHuman())
          );
          reject();
        }
      }
    });
  });

  console.log('Setup Complete!');
};

main().catch(console.error).finally(process.exit);
