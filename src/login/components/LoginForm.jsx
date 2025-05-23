import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '@/context/userContext';
import Image from 'next/image';
import Link from 'next/link';
import googleLogo from '../../../public/img/google.png';
import { BiLockAlt, BiEnvelope } from 'react-icons/bi';
import { useRouter } from 'next/router';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const LoginForm = () => {
  const userContext = useContext(UserContext);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    clearErrors('root');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (response.ok) {
        const { user, token } = await response.json();
        userContext.setUser(user);
        userContext.setToken(token);
      } else {
        setError('root', {
          type: 'manual',
          message: 'Złe dane logowania.',
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Wystąpił problem z połączeniem. Spróbuj ponownie później.',
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full justify-center items-center max-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[70%] sm:w-[50%] md:w-[35%] h-[85%] py-2 px-5 sm:py-5 sm:px-8 lg:py-7 lg:px-10 bg-white rounded-4xl shadow-lg justify-center"
        noValidate
      >
        <label className="text-[#264653] pb-3 text-xl md:text-4xl font-bold text-center">
          Zaloguj się!
        </label>

        {/* Input section */}
        <div className="flex flex-col w-full space-y-4">
          {/* Email input section */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="email"
              className="text-[#264653] text-lg font-bold text-left flex items-center gap-2"
            >
              <BiEnvelope className="text-[#AA673C]" />
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
            <div className="top-full left-0 w-full h-5">
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
              <BiLockAlt className="text-[#AA673C]" />
              Hasło
            </label>
            <input
              id="password"
              className="px-2 py-2 w-full rounded-lg border bg-[#fefaf7] border-[#FFD1DC] text-black focus:outline-none focus:ring-2 focus:ring-[#AA673C]"
              type="password"
              {...register('password', {
                required: 'Hasło jest wymagane.',
              })}
              placeholder="Wpisz swoje hasło"
              autoComplete="new-password"
            />
            {/* Password error message container with fixed height */}
            <div className="top-full left-0 w-full h-4">
              {errors.password && (
                <p className="text-red-500 text-sm text-center">
                  {errors.password.message}
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
              {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </div>
        </div>

        {/* Google login button */}
        <div className="flex w-full h-full mt-4 p-2 sm:p-5 items-center justify-center">
          <button
            onClick={() => router.replace(`${API_BASE_URL}/auth/google`)}
            className="bg-white text-[#333] border border-[#ccc] rounded-lg px-4 py-2 text-base flex items-center gap-2 hover:bg-[#f0f0f0] cursor-pointer"
          >
            <Image src={googleLogo} alt="Google icon" width={20} height={20} />
            <label className="text-sm sm:text-base cursor-pointer">
              Zaloguj się z Google
            </label>
          </button>
        </div>

        {/* Registration message */}
        <div className="flex flex-col sm:flex-row w-full items-center justify-center mt-6">
          <p className="text-xs md:text-sm sm:pr-1 text-gray-600">
            Nie masz konta?
          </p>
          <p className="text-xs md:text-sm text-gray-600 cursor-pointer">
            <Link
              href="/registerPage"
              className="text-[#CE8455] hover:underline font-bold"
            >
              Zarejestruj się
            </Link>
          </p>
        </div>
      </form>
      {/* Error message modal for root errors */}
      {errors.root && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-[90%] sm:w-[50%] md:w-[30%]">
            <p className="text-red-500 text-lg font-bold mb-4">
              {errors.root.message}
            </p>
            <button
              onClick={() => clearErrors('root')}
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

export default LoginForm;
