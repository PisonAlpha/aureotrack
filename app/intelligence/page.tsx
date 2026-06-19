'use client';

import { useEffect } from 'react';

export default function Intelligence() {
  useEffect(() => {
    window.location.href = '/markets';
  }, []);
  return null;
}