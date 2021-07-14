// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgress://localhost/aceladder'

  },

  production: {
    client: 'pg',
    connection: {
      database: 'aceladder',
      host: 'local',
      user: 'postgres',
      password: 'pass'
    }
  }

};
