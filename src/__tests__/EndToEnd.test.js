/**
 * @jest-environment node
 */

import puppeteer from 'puppeteer';

jest.setTimeout(30000); // Sets default timeout for each test

describe('show/hide event details', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    page = await browser.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.event', { timeout: 15000 });
  });

  afterAll(async () => {
    await browser.close();
  });

  test('An event element is collapsed by default', async () => {
    const eventDetails = await page.$('.event .event-details');
    expect(eventDetails).toBeNull();
  });

  test('User can expand an event to see details', async () => {
    await page.click('.event button');
    const eventDetails = await page.$('.event .event-details');
    expect(eventDetails).toBeDefined();
  });

  test('User can collapse an event to hide details', async () => {
    await page.click('.event button');
    const eventDetails = await page.$('.event .event-details');
    expect(eventDetails).toBeNull();
  });