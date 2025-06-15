import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, 'fixtures/example.txt');

test('process example file', async ({ page }) => {
  await page.goto('/');
  await page.setInputFiles('input[type="file"]', filePath);
  await expect(page.getByText('✅ Réussi')).toBeVisible();
  await expect(page.getByText('example.txt')).toBeVisible();
  await expect(page.getByText('Télécharger le JSON')).toBeVisible();
});
