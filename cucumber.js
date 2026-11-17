module.exports = {
  default: {
    paths: ['tests/e2e/**/*.feature'],
    format: ['pretty', 'json:playwright-report/results.json', 'html:playwright-report/results.html'],
    require: ['tests/e2e/support/**/*.ts', 'tests/e2e/steps/**/*.steps.ts'],
    requireModule: ['ts-node/register'],
  },
};
