module.exports = {
  apps: [
    {
      name: 'adonis-app',
      script: './build/bin/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
