import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { UserContext } from '@/context/userContext';
import Image from 'next/image';
import googleLogo from '../../../public/img/google.png';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const RegisterForm = () => {
  const router = useRouter();
  const userContext = useContext(UserContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      lastname: '',
    },
  });

  const password = watch('password', '');

  const passwordRequirements =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/;

  const onSubmit = async (data) => {
    clearErrors('global');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        userContext.setUser(responseData.user);
        userContext.setToken(responseData.token);
      } else if (response.status === 409) {
        setError('global', {
          type: 'manual',
          message: 'Dany email jest już zajęty.',
        });
      } else {
        setError('global', {
          type: 'manual',
          message: 'Wystąpił problem podczas rejestracji.',
        });
      }
    } catch (error) {
      setError('global', {
        type: 'manual',
        message: 'Wystąpił problem z połączeniem. Spróbuj ponownie później.',
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full justify-center items-center max-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[80%] sm:w-[50%] md:w-[35%] h-[92%] py-2 px-5 sm:py-5 sm:px-8 lg:py-7 lg:px-10 bg-white rounded-4xl shadow-lg justify-center"
        noValidate
      >
        <label className="text-[#264653] pb-3 text-xl md:text-4xl font-bold text-center">
          Zarejestruj się!
        </label>

        {/* Input section */}
        <div className="flex flex-col w-full space-y-4">
          {/* Name and Lastname input section */}
          <div className="flex flex-row w-full space-x-4">
            {/* Name input section */}
            <div className="w-full">
              <label
                htmlFor="name"
                className="text-[#264653] text-lg font-bold text-left flex items-center gap-2"
              >
                Imię
              </label>
              <input
                id="name"
                className="px-2 py-2 w-full rounded-lg border bg-[#fefaf7] border-[#FFD1DC] text-black focus:outline-none focus:ring-2 focus:ring-[#AA673C]"
                type="text"
                placeholder="Wpisz swoje imię"
                {...register('name', { required: 'Imię jest wymagane.' })}
              />
              {/* Name error message container with fixed height */}
              <div className="top-full left-0 w-full h-4 sm:h-3">
                {errors.name && (
                  <p className="text-red-500 text-sm text-center">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full">
              {/* Lastname input section */}
              <label
                htmlFor="lastname"
                className="text-[#264653] text-lg font-bold text-left flex items-center gap-2"
              >
                Nazwisko
              </label>
              <input
                id="lastname"
                className="px-2 py-2 w-full rounded-lg border bg-[#fefaf7] border-[#FFD1DC] text-black focus:outline-none focus:ring-2 focus:ring-[#AA673C]"
                type="text"
                placeholder="Wpisz swoje nazwisko"
                {...register('lastname', {
                  required: 'Nazwisko jest wymagane.',
                })}
              />
              {/* Lastname error message container with fixed height */}
              <div className="top-full left-0 w-full h-4 sm:h-3">
                {errors.name && (
                  <p className="text-red-500 text-sm text-center">
                    {errors.lastname.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Email input section */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="email"
              className="text-[#264653] text-lg font-bold text-left flex items-center gap-2"
            >
              Email
            </label>
            <input
              id="email"
              className="px-2 py-2 w-full rounded-lg border bg-[#fefaf7] border-[#FFD1DC] text-black focus:outline-none focus:ring-2 focus:ring-[#AA673C]"
              type="email"
              {...register('email', {
                required: 'Email jest wymagany.',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Nieprawidłowy format adresu e-mail.',
                },
              })}
              placeholder="Wpisz swój adres e-mail"
              autoComplete="off"
            />
            {/* Email error message container with fixed height */}
            <div className="top-full left-0 w-full h-3">
              {errors.email && (
                <p className="text-red-500 text-sm text-center">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Password input section */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="password"
              className="text-[#264653] text-lg font-bold text-left flex items-center gap-2"
            >
              Hasło
            </label>
            <input
              id="password"
              className="px-2 py-2 w-full rounded-lg border bg-[#fefaf7] border-[#FFD1DC] text-black focus:outline-none focus:ring-2 focus:ring-[#AA673C]"
              type="password"
              placeholder="Hasło"
              autoComplete="new-password"
              {...register('password', {
                required: 'Hasło jest wymagane.',
                validate: (value) =>
                  passwordRequirements.test(value) ||
                  'Hasło musi mieć co najmniej 12 znaków, zawierać dużą literę, cyfrę i znak specjalny.',
              })}
            />
            {/* Password error message container with fixed height */}
            <div className="top-full left-0 w-full h-4">
              {errors.password && (
                <p className="text-red-500 text-sm sm:text-sm text-center">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          {/* Confirm password input section */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="confirmPassword"
              className="text-[#264653] text-lg font-bold text-left flex items-center gap-2"
            >
              Powtórz hasło
            </label>
            <input
              id="confirmPassword"
              className="px-2 py-2 w-full rounded-lg border bg-[#fefaf7] border-[#FFD1DC] text-black focus:outline-none focus:ring-2 focus:ring-[#AA673C]"
              type="password"
              placeholder="Powtórz hasło"
              autoComplete="new-password"
              {...register('confirmPassword', {
                required: 'Powtórz hasło.',
                validate: (value) =>
                  value === password || 'Hasła muszą być takie same!',
              })}
            />
            {/* Confirm password error message container with fixed height */}
            <div className="top-full left-0 w-full h-4">
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm text-center">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          {/* Submit button */}
          <div className="w-full h-full min-h-[2rem] lg:min-h-[3rem] mt-2 relative">
            <button
              className="px-2 py-2 w-full h-full bg-[#CE8455] text-white hover:bg-[#AA673C] rounded-full transition-all duration-300 transform hover:scale-105 
                    text-sm sm:text-base md:text-lg whitespace-nowrap cursor-pointer"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Rejestracja...' : 'Zarejestruj się'}
            </button>
          </div>
        </div>
        {/* Google login button */}
        <div className="flex w-full h-full mt-4 px-2 pt-2 sm:px-5 sm:pt-5 items-center justify-center">
          <button
            onClick={() => router.replace(`${API_BASE_URL}/auth/google`)}
            className="bg-white text-[#333] border border-[#ccc] rounded-lg px-4 py-1 text-base flex items-center gap-2 hover:bg-[#f0f0f0] cursor-pointer"
          >
            <Image src={googleLogo} alt="Google icon" width={20} height={20} />
            <label className="text-xs sm:text-base cursor-pointer">
              Zarejestruj się z Google
            </label>
          </button>
        </div>
        {/* Registration message */}
        <div className="flex flex-col sm:flex-row w-full items-center justify-center pt-2">
          <p className="text-xs md:text-sm sm:pr-1 text-gray-600">
            Masz już konto?
          </p>
          <p className="text-xs md:text-sm text-gray-600 cursor-pointer">
            <Link
              href="/loginPage"
              className="text-[#CE8455] hover:underline font-bold"
            >
              Zaloguj się
            </Link>
          </p>
        </div>
      </form>
      {/* Error message modal for global errors */}
      {errors.global && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-[90%] sm:w-[50%] md:w-[30%]">
            <p className="text-red-500 text-lg font-bold mb-4">
              {errors.global.message}
            </p>
            <button
              onClick={() => clearErrors('global')}
              className="px-4 py-2 bg-[#CE8455] text-white rounded-lg hover:bg-[#AA673C] transition-all"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
