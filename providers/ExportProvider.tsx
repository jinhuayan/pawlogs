import React, { createContext, useState, ReactNode } from 'react';
import { appendDailyLogs } from '../lib/googlesheets';

type ExportContextType = {
  exporting: boolean;
  error: string | null;
  exportLogs: (logs: any[]) => Promise<void>;
};

export const ExportContext = createContext<ExportContextType>({
  exporting: false,
  error: null,
  exportLogs: async () => {},
});

export function ExportProvider({ children }: { children: ReactNode }) {
  const [exporting, setExporting] = useState(false);


  const [error, setError] = useState<string | null>(null);

  const exportLogs = async (logs: any[]) => {

    setExporting(true);

    setError(null);
    try {
        
      const updates = await appendDailyLogs(
        'YOUR_SPREADSHEET_ID',
        'Logs',
        logs
      );
      console.log('Exported rows:', updates?.updatedRows);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <ExportContext.Provider value={{ exporting, error, exportLogs }}>
      {children}
    </ExportContext.Provider>
  );
}