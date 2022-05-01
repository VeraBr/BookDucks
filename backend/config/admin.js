module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'bad9a7e667f8bbd9cfe85031f394e41c'),
  },
});
