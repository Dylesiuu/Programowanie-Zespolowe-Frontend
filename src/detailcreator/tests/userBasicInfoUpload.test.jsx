import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserBasicInfoUpload from '../components/UserBasicInfoUpload';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/router';
import { useAuthFetch } from '../../lib/authFetch';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

/* eslint-disable @next/next/no-img-element */
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} alt={props.alt || ''} />,
}));

jest.mock('../../lib/authFetch', () => ({
  useAuthFetch: jest.fn(),
}));

global.URL.createObjectURL = jest.fn(() => 'mock-url');

const mockUser = {
  _id: '123',
  name: 'Jan',
  lastname: 'Kowalski',
  description: 'Opis testowy',
  avatar: {
    preview: '/img/default-avatar.svg',
  },
};

const mockSetUser = jest.fn();
const mockPush = jest.fn();
const mockFetch = jest.fn();

beforeEach(() => {
  useAuthFetch.mockReturnValue(mockFetch);
  useRouter.mockReturnValue({ push: mockPush });
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ user: mockUser }),
  });
});

const renderComponent = () =>
  render(
    <UserContext.Provider
      value={{ user: mockUser, setUser: mockSetUser, token: 'token123' }}
    >
      <UserBasicInfoUpload />
    </UserContext.Provider>
  );

describe('UserBasicInfoEditor', () => {
  it('renders with initial user data', async () => {
    renderComponent();

    expect(await screen.findByDisplayValue('Jan')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('Kowalski')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('Opis testowy')).toBeInTheDocument();
    expect(await screen.findByAltText('Podgląd')).toBeInTheDocument();
  });

  it('allows editing name, lastname and description', async () => {
    renderComponent();

    const nameInput = await screen.findByLabelText('Imię');
    const lastnameInput = await screen.findByLabelText('Nazwisko');
    const descTextarea = await screen.findByLabelText('Opis');

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Adam');

    await userEvent.clear(lastnameInput);
    await userEvent.type(lastnameInput, 'Nowak');

    await userEvent.clear(descTextarea);
    await userEvent.type(descTextarea, 'Nowy opis');

    expect(nameInput).toHaveValue('Adam');
    expect(lastnameInput).toHaveValue('Nowak');
    expect(descTextarea).toHaveValue('Nowy opis');
  });

  // it('uploads avatar when file is selected', async () => {
  //   renderComponent();
  //
  //   global.URL.createObjectURL = jest.fn(() => 'mock-url');
  //
  //   const fileInput = screen.getByLabelText(/zdjęcie/i);
  //   const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
  //
  //   await userEvent.upload(fileInput, file);
  //
  //   const img = await screen.findByAltText('Podgląd');
  //   expect(img).toBeInTheDocument();
  //   expect(img).toHaveAttribute('src', 'mock-url');
  //   expect(fileInput.files[0]).toBe(file);
  //   expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
  //
  //   global.URL.createObjectURL.mockReset();
  // });
  //
  // it('handles avatar upload process correctly', async () => {
  //   // Mock the fetch responses for avatar upload process
  //   mockFetch
  //     .mockImplementationOnce(async () => ({ ok: true })) // delete old avatar
  //     .mockImplementationOnce(async () => ({
  //       ok: true,
  //       json: async () => ({
  //         publicId: 'new-public-id',
  //         url: 'new-avatar-url',
  //       }),
  //     })) // upload new avatar
  //     .mockImplementationOnce(async () => ({
  //       ok: true,
  //       json: async () => ({
  //         user: {
  //           ...mockUser,
  //           avatar: {
  //             publicId: 'new-public-id',
  //             preview: 'new-avatar-url',
  //           },
  //         },
  //       }),
  //     })); // update user with new avatar
  //
  //   renderComponent();
  //
  //   // Select a file
  //   const fileInput = screen.getByLabelText(/zdjęcie/i);
  //   const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
  //   await userEvent.upload(fileInput, file);
  //
  //   // Verify preview is shown
  //   const img = await screen.findByAltText('Podgląd');
  //   expect(img).toHaveAttribute('src', 'mock-url');
  //
  //   // Submit the form
  //   const submitBtn = screen.getByRole('button', { name: /zapisz zmiany/i });
  //   await userEvent.click(submitBtn);
  //
  //   // Verify the avatar upload process was called correctly
  //   await waitFor(() => {
  //     // Check if old avatar was deleted (if existed)
  //     if (mockUser.avatar?.publicId) {
  //       expect(mockFetch).toHaveBeenCalledWith(
  //         expect.stringContaining(`/images/${mockUser.avatar.publicId}`),
  //         expect.objectContaining({ method: 'DELETE' })
  //       );
  //     }
  //
  //     // Check if new avatar was uploaded and user was updated
  //     expect(mockFetch).toHaveBeenCalledWith(
  //       expect.stringContaining('/user/updateUserAvatar'),
  //       expect.objectContaining({ method: 'PATCH' })
  //     );
  //
  //     // Verify user context was updated with new avatar
  //     expect(mockSetUser).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         avatar: expect.objectContaining({
  //           publicId: 'new-public-id',
  //           preview: 'new-avatar-url',
  //         }),
  //       })
  //     );
  //   });
  //
  //   // Verify success message
  //   expect(await screen.findByText(/zaktualizowano dane/i)).toBeInTheDocument();
  // });

  it('submits form and redirects after success', async () => {
    mockFetch
      .mockImplementationOnce(async () => ({
        ok: true,
        json: async () => ({ user: mockUser }),
      }))
      .mockImplementationOnce(async () => ({
        ok: true,
        json: async () => ({ user: mockUser }),
      }))
      .mockImplementationOnce(async () => ({
        ok: true,
        json: async () => ({ user: mockUser }),
      }));

    renderComponent();

    const submitBtn = await screen.findByRole('button', {
      name: /zapisz zmiany/i,
    });

    await userEvent.click(submitBtn);

    expect(await screen.findByText(/zaktualizowano dane/i)).toBeInTheDocument();
  });

  it('navigates to profile on "Wróć do profilu" click', async () => {
    renderComponent();

    const backButton = await screen.findByRole('button', {
      name: /wróć do profilu/i,
    });

    await userEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith(
      `/userProfilePage?userId=${mockUser._id}`
    );
  });
});
