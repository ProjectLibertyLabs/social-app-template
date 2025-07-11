import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';
import { InjectedConnector } from '@web3-react/injected-connector';
import { AbstractConnector } from '@web3-react/abstract-connector';

// Initialize Web3 React connector
export const injectedConnector = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42], // Ethereum networks
});

export class WalletService {
  private static connector: AbstractConnector = injectedConnector;

  static async connectPolkadot() {
    try {
      const extensions = await web3Enable('SIWF Demo App');
      if (extensions.length === 0) {
        throw new Error('No Polkadot extension found');
      }

      const allAccounts = await web3Accounts();
      if (allAccounts.length === 0) {
        throw new Error('No Polkadot accounts found');
      }

      return allAccounts[0]; // Return first account for demo
    } catch (error) {
      console.error('Polkadot connection error:', error);
      throw new Error('Failed to connect Polkadot wallet');
    }
  }

  static async connectMetamask() {
    try {
      // Activate the Web3 React connector
      await this.connector.activate();
      
      // Get the provider from window.ethereum
      const provider = (window as any).ethereum;
      if (!provider) {
        throw new Error('No Ethereum provider found');
      }

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('No Metamask accounts found');
      }
      
      return accounts[0];
    } catch (error) {
      console.error('Metamask connection error:', error);
      throw new Error('Failed to connect Metamask');
    }
  }

  static async signMessagePolkadot(account: any, message: string) {
    try {
      // TODO: Implement Polkadot message signing
      // This would require the actual Polkadot signing implementation
      console.warn('Polkadot signing not implemented');
      return '';
    } catch (error) {
      console.error('Polkadot signing error:', error);
      throw new Error('Failed to sign message with Polkadot');
    }
  }

  static async signMessageMetamask(account: string, message: string) {
    try {
      const provider = (window as any).ethereum;
      if (!provider) {
        throw new Error('No Ethereum provider found');
      }

      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, account],
      });
      return signature;
    } catch (error) {
      console.error('Metamask signing error:', error);
      throw new Error('Failed to sign message with Metamask');
    }
  }
} 