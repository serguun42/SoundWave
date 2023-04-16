/** @type {import('../types/api').APIMethod} */
export const SignIn = (params) => {
  params.sendPayload(200, 'SignIn');
};

/** @type {import('../types/api').APIMethod} */
export const SignUp = (params) => {
  params.sendPayload(200, 'SignUp');
};
