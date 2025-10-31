module.exports = {
  default: {
    require: ['features/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:cucumber-report.html',
      'json:cucumber-report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    worldParameters: {
      appUrl: 'https://www.kainos.com'
    },
    parallel: 1
  }
};