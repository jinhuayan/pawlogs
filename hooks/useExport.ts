import { useContext } from 'react';
import { ExportContext } from '../providers/ExportProvider';

export function useExport() {
  const ctx = useContext(ExportContext);
  return ctx;
}