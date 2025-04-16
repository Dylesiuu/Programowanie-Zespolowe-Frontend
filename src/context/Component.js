import { useContext } from 'react';
import { UserContext } from './userContext';

export const Component = () => {
  const userContext = useContext(UserContext);

  return (
    <div>
      <input
        value={userContext.token}
        placeholder="enter token"
        onChange={(event) => userContext.setToken(event.target.value)}
      />
      <p>Token is {userContext.token}</p>
      <p>UserId is {userContext.userId}</p>
    </div>
  );
};

export const SecondComponent = () => {
  const userContext = useContext(UserContext);

  return (
    <p data-testid="second-component">
      Hello, I am a second component, and I know, that token is{' '}
      {userContext.token}
    </p>
  );
};
