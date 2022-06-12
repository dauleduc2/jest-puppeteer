const puppeteer = require("puppeteer");
let browser = null;
let page = null;
let context = null;
jest.setTimeout(60000);

const email = "admin@gmail.com";
const correctPassword = "123456789";
const wrongPassword = "1234567890";

describe("Test FUQuiz", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      slowMo: 200,
      headless: false,
    });

    page = await browser.newPage();

    await page.setViewport({ width: 1480, height: 720 });
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Go to the page and check maximum of latest post", async () => {
    await page.goto("http://localhost:3000");
    expect.assertions(1);
    try {
      await page.waitForSelector(
        "#__next > div.flex.flex-col.w-full.h-full.min-h-screen.bg-gray-200 > div > div > div > div > div > div > nav > div > div.flex.flex-col.space-y-5.divide-y-2 > div > div:nth-child(1)"
      );
      const latestPostLength = await page.$eval(
        "#__next > div.flex.flex-col.w-full.h-full.min-h-screen.bg-gray-200 > div > div > div > div > div > div > nav > div > div.flex.flex-col.space-y-5.divide-y-2 > div",
        (el) => {
          {
            return el.childElementCount;
          }
        }
      );

      expect(latestPostLength).toBeLessThanOrEqual(3);
    } catch (error) {
      console.log(error);
    }
  });
});

describe("Test Login function", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      slowMo: 100,
      headless: false,
    });
    context = await browser.createIncognitoBrowserContext();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await context.newPage();

    // clear cookies on run
    const client = await page.target().createCDPSession();
    await await client.send("Network.clearBrowserCookies");

    await page.setViewport({ width: 1480, height: 720 });
    await page.goto("http://localhost:3000/auth/login");
  });

  it("Login failed", async () => {
    await page.type("input[name='email']", email);
    await page.type("input[name='password']", wrongPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    const url = await page.url();
    expect(url).toBe("http://localhost:3000/auth/login");
  });

  it("Login Success", async () => {
    await page.type("input[name='email']", email);
    await page.type("input[name='password']", correctPassword);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    const url = await page.url();
    expect(url).toBe("http://localhost:3000/");
  });
});
