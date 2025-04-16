const { render, screen } = require('@testing-library/react');
const { Component, SecondComponent } = require('./Component');
const { UserContext, UserProvider } = require('./userContext');
const { default: userEvent } = require('@testing-library/user-event');

describe('', () => {
  it('should set token and userId', async () => {
    render(
      <UserProvider>
        <Component />
        <SecondComponent />
      </UserProvider>
    );

    expect(screen.getByText('Token is token-token')).toBeInTheDocument();

    await userEvent.clear(screen.getByPlaceholderText('enter token'));
    await userEvent.type(
      screen.getByPlaceholderText('enter token'),
      'new-token'
    );

    screen.debug();

    expect(screen.getByText('Token is new-token')).toBeInTheDocument();
    expect(screen.getByText('UserId is 123-456')).toBeInTheDocument();
  });
});
