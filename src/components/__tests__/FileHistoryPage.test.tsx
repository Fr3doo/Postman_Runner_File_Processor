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
});
