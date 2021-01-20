const createDispatcher = (actionType, actionData) => {
  if (typeof actionType !== 'string') {
    throw new Error('Expected actionType to be string.');
  }
  return {
    type: actionType,
    data: actionData,
  };
};
export default createDispatcher;
