const LoggedUser = () => {
  return (
    <div className="flex flex-col h-full w-full justify-center items-center max-h-screen">
      <div className="flex flex-col w-[70%] sm:w-[50%] md:w-[35%] h-[50%] py-2 px-5 sm:py-5 sm:px-8 lg:py-7 lg:px-10 bg-white rounded-4xl shadow-lg justify-center">
        <p className="text-[#264653] text-xl sm:text-3xl text-center font-bold mb-4">
          Jesteś zalogowany!
        </p>
        <p className="text-gray-600 text-center text-sm">
          Za chwilę zostaniesz przekierowany na stronę główną...
        </p>
      </div>
    </div>
  );
};

export default LoggedUser;
