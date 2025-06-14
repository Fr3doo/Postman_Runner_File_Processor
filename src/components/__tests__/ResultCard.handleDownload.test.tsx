import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResultCard } from '../ResultCard';
import * as fileParser from '../../utils/fileParser';

describe('ResultCard handleDownload', () => {
  it('passes summary and sanitized filename to downloadJSON', () => {
    const summary = {
      nombre_fichiers_restants: 1,
      numero_teledemarche: 'TD',
      nom_projet: 'Project',
      numero_dossier: 'D1',
      date_depot: '2024-01-01',
    };

    vi.spyOn(fileParser, 'downloadJSON').mockImplementation(() => {});

    render(
      <ResultCard
        file={{ id: '1', filename: 'report.txt', status: 'success', summaries: [summary] }}
      />,
    );

    fireEvent.click(screen.getByText(/Télécharger le JSON/));

    expect(fileParser.downloadJSON).toHaveBeenCalledWith(summary, 'report-1');

    vi.restoreAllMocks();
  });
});
