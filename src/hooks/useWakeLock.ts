import { useEffect, useRef, useState } from 'react';

export const useWakeLock = (shouldLock: boolean) => {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          setIsLocked(true);
          wakeLockRef.current.addEventListener('release', () => {
            setIsLocked(false);
          });
        } catch (err) {
          console.error(`${err} - Wake Lock request failed`);
        }
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        } catch (err) {
          console.error(`${err} - Wake Lock release failed`);
        }
      }
    };

    if (shouldLock) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [shouldLock]);

  return isLocked;
};
