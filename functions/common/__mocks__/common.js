const getGCPAuthorizedClient = () => {
  return new Promise(resolve => {
    resolve({ test: true });
  });
};

const getUser = () => {
  return new Promise(resolve => {
    resolve({ access_token: 'dummy' });
  });
};
module.exports.getGCPAuthorizedClient = getGCPAuthorizedClient;
