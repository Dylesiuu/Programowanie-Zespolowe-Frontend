import React, { useContext, useEffect } from 'react';
import RegisterForm from '../src/register/components/RegisterForm';
import { UserContext } from '@/context/userContext';
import { useRouter } from 'next/router';

const RegisterPage = () => {
  const userContext = useContext(UserContext);

  return (
    <div className="m-0 p-0 h-[100vh] w-[100vw] bg-[url('/Union.svg')] bg-repeat bg-[length:150rem_100rem] bg-[#FFF0E9]">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
