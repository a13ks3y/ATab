const puppeteer = require('puppeteer');
const sinon = require("sinon");

const chrome = {
    tabs: {
        query: jest.fn(),
    },
};

// Set up a new browser instance before all tests
beforeAll(async () => {
    // global.browser = await puppeteer.launch();
    Object.assign(global, require('jest-chrome'));

    //jest.mock('chrome', () => chrome);
});

// Tear down the browser instance after all tests are done
afterAll(async () => {
    // await global.browser.close();
});

// Set up sinon sandbox for mocking and stubbing extension APIs
beforeEach(() => {
    global.sandbox = sinon.createSandbox();
});

// Restore the sinon sandbox after each test
afterEach(() => {
    global.sandbox.restore();
});
