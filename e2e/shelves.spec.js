import { expect, test } from '@playwright/test';

test.describe('shelves', () => {
  test('starts with no shelf selected', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Reading list' })).toBeVisible();
    await expect(page.getByRole('status')).toHaveText('Pick a shelf');
  });

  test('opens the Reading shelf', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Reading' }).click();
    await expect(page.getByRole('status')).toHaveText('2 books');
    await expect(page.getByRole('listitem')).toHaveCount(2);
  });

  test('opens the Finished shelf', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Finished' }).click();
    await expect(page.getByRole('status')).toHaveText('3 books');
    await expect(page.getByRole('button', { name: 'Finished' })).toHaveAttribute('aria-pressed', 'true');
  });

  test.skip('exports the shelf as CSV', async () => {});

  // Seeded flaky test for Observed's Playwright importer: it fails on the
  // first attempt and passes on the retry.
  test('keeps the count after a second click', async ({ page }, testInfo) => {
    await page.goto('/');
    const reading = page.getByRole('button', { name: 'Reading' });
    await reading.click();
    await reading.click();
    await expect(page.getByRole('status')).toHaveText(
      testInfo.retry === 0 ? '3 books' : '2 books',
      { timeout: 2000 },
    );
  });
});
