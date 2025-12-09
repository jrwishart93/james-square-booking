import { getApp } from 'firebase/app';
import { connectFunctionsEmulator, Functions, getFunctions } from 'firebase/functions';

const functionsClient = (() => {
  if (typeof globalThis !== 'undefined' && (globalThis as GlobalWithFunctions).__functionsClient) {
    return (globalThis as GlobalWithFunctions).__functionsClient as Functions;
  }

  const instance = getFunctions(getApp());

  if (process.env.NEXT_PUBLIC_USE_EMULATOR === '1') {
    const host = process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_HOST ?? 'localhost';
    const port = Number(process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_PORT ?? '5001');

    const globalRef = globalThis as GlobalWithFunctions;
    if (!globalRef.__functionsEmulatorConnected) {
      connectFunctionsEmulator(instance, host, port);
      globalRef.__functionsEmulatorConnected = true;
    }
  }

  if (typeof globalThis !== 'undefined') {
    (globalThis as GlobalWithFunctions).__functionsClient = instance;
  }

  return instance;
})();

interface GlobalWithFunctions {
  __functionsClient?: Functions;
  __functionsEmulatorConnected?: boolean;
}

export { functionsClient };
