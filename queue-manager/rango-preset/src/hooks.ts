import type { UseQueueManagerParams } from './types';

import { useManager } from '@rango-dev/queue-manager-react';
import { useEffect, useState } from 'react';

import {
  checkWaitingForConnectWalletChange,
  checkWaitingForNetworkChange,
  retryOn,
} from './helpers';
import { migrated, migration } from './migration';
import { eventEmitter } from './services/eventEmitter';

let isCalled = 0;

/**
 *
 * Runs a migration (old swaps from localstorage to queue manager's IndexedDB)
 * It will be run only once on page load.
 *
 */
function useMigration(): {
  status: boolean;
} {
  const isMigrated = migrated();
  const [status, setStatus] = useState<boolean>(isMigrated);

  useEffect(() => {
    void (async () => {
      // Preventing react to be called twice on Strict Mode (development)
      if (isCalled) {
        return;
      }
      isCalled = 1;

      migration().finally(() => {
        setStatus(true);
      });
    })();
  }, []);

  return {
    status,
  };
}

/**
 *
 * On initial load and also connect/disconnet we may need to update swap's notified message.
 * And also if a new wallet is connected we will retry the queue to see we can resume it or not.
 *
 */
function useQueueManager(params: UseQueueManagerParams): void {
  const { manager } = useManager();

  useEffect(() => {
    if (params.lastConnectedWallet) {
      checkWaitingForConnectWalletChange({
        evmChains: params.evmChains,
        wallet_network: params.lastConnectedWallet,
        manager,
      });
      retryOn(params.lastConnectedWallet, manager, params.canSwitchNetworkTo);
    }
  }, [params.lastConnectedWallet]);

  useEffect(() => {
    if (params.disconnectedWallet) {
      checkWaitingForNetworkChange(manager);

      /*
       *We need to reset the state value, so if a wallet disconnected twice (after reconnect),
       *this effect will be run properly.
       */
      params.clearDisconnectedWallet();
    }
  }, [params.disconnectedWallet]);
}

function useEvents() {
  /**
   * Making the 'all' method accessible runs the risk of removing all handlers already linked to all events,
   * leading to unforeseen side effects in our widget or in Dapps that utilize it.
   * Instead, we can utilize the 'off' method to detach listeners for specific events.
   */
  const { all, ...otherMethods } = eventEmitter;
  return otherMethods;
}

export { useQueueManager, useMigration, useEvents };
