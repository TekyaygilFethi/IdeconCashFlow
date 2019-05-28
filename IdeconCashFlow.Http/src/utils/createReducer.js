const createReducer = ({ types, mapActionToKey }) => {
    if (!Array.isArray(types) || types.length < 3) {
      throw new Error('Expected types to be an array of three elements.');
    }
    if (!types.every(t => typeof t === 'string')) {
      throw new Error('Expected types to be strings.');
    }
    if (typeof mapActionToKey !== 'function') {
      throw new Error('Expected mapActionToKey to be a function.');
    }
    const [requestType, successType, failureType, clearType] = types;
  
    const updateReducer = (
      state = {
        isFetching: false,
        isLoaded: false,
        isFailure: false,
      },
      action,
    ) => {
      switch (action.type) {
  
        case requestType:
          return {
            ...state,
            isFetching: true,
            isFailure: false,
            isLoaded: false,
            data: action.data,
          };
        case successType:
          return {
            ...state,
            isFetching: false,
            isFailure: false,
            isLoaded: true,
            data: action.data,
          };
        case failureType:
          return {
            ...state,
            isFetching: false,
            isFailure: true,
            isLoaded: false,
            data: action.data,
          };
        case clearType:
          return {
            isFetching: false,
            isLoaded: false,
            isFailure: false,
            data: [],
          };
        default:
          return state;
      }
    };
  
    return (state = {}, action) => {
      // Update pagination by key
      switch (action.type) {
        case requestType:
        case successType:
        case failureType:
        case clearType: {
          const key = mapActionToKey(action);
          if (typeof key !== 'string') {
            throw new Error('Expected key to be a string.');
          }
          return {
            ...state,
            ...updateReducer(state[key], action),
          };
        }
        default:
          return state;
      }
    };
  };
  export default createReducer;
  