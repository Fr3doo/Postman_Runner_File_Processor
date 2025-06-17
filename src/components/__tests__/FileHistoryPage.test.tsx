import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../App';

const historyItem = {
  id: 'x',
  filename: 'x.txt',
  status: 'success',
  summaries: [
    {
      nombre_fichiers_restants: 1,
      numero_teledemarche: 'TD',
      nom_projet: 'Project',
      numero_dossier: 'D1',
      date_depot: '2024-01-01',
    },
  ],
};

describe('FileHistoryPage via App navigation', () => {
  it('shows history page and updates stats when clearing', async () => {
    window.localStorage.setItem('fileHistory', JSON.stringify([historyItem]));

    render(<App />);

    const filesLink = screen.getByRole('link', { name: 'Fichiers' });
    fireEvent.click(filesLink);

    expect(screen.getAllByText('Historique des fichiers').length).toBeGreaterThan(0);
    expect(screen.getByText('Résumé du traitement')).toBeTruthy();

    fireEvent.click(screen.getByText("Effacer l'historique"));

    await waitFor(() => {
      expect(screen.queryByText('Résumé du traitement')).toBeNull();
    });
  });

  it('displays metrics when present', () => {
    const metricsItem = {
      ...historyItem,
      size: 2048,
      processedAt: 1700000000000,
      recordCount: 3,
      durationMs: 150,
    };
    window.localStorage.setItem('fileHistory', JSON.stringify([metricsItem]));

    render(<App />);

    const filesLink = screen.getByRole('link', { name: 'Fichiers' });
    fireEvent.click(filesLink);

    expect(screen.getByText(/^Taille/)).toBeTruthy();
    expect(screen.getByText('2.0 KB')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText(/150 ms/)).toBeTruthy();
    const dateLabel = new Date(1700000000000).toLocaleString();
    expect(screen.getByText(dateLabel)).toBeTruthy();
  });
});
