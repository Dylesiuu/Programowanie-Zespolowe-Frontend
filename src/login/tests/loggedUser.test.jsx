import { render, screen } from '@testing-library/react';
import LoggedUser from '../components/loggedUser';

describe('LoggedUser Component', () => {
  it('renders the correct message', async () => {
    render(<LoggedUser />);

    const mainMessage = await screen.findByText('Jesteś już zalogowany!');
    expect(mainMessage).toBeInTheDocument();

    const subText = await screen.findByText(
      'Za chwilę zostaniesz przekierowany na stronę główną...'
    );
    expect(subText).toBeInTheDocument();
  });
});
