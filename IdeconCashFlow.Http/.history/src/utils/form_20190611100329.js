// import * as _ from 'lodash';

const unitFunction = x => x;

export const control = (parent, fieldName, setter, getter) => {
  const mySetter = setter || unitFunction;
  const myGetter = getter || unitFunction;
  return {
    value: myGetter(parent.state[fieldName]),
    onChange: newValue => {
      parent.setState({
        errors: {
          ...parent.state.errors,
          [fieldName]: '',
        },
        [fieldName]: mySetter(newValue),
      });
    },
  };
};

export default unitFunction;
