'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import img from '../public/img/mainPagePic.png';
import googleLogo from '../public/img/google.png';
import { useRouter } from 'next/router';

const MainPage = () => {
  const Router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  return (
    <div className="bg-gradient-to-b from-[#fff5ec] to-[#ffe8dc] min-h-screen text-[#333] p-8 box-border">
      <div className="flex justify-between items-center pb-8">
        <h1 className="text-2xl font-bold text-[#264653]">Petfinity</h1>
        <div className="flex gap-4 flex-col md:flex-row">
          <Link href="/loginPage">
            <span className="bg-[#f4a261] text-white px-4 py-2 rounded-xl font-bold cursor-pointer text-center block">
              Zaloguj się
            </span>
          </Link>
          <Link href="/registerPage">
            <span className="bg-[#f4a261] text-white px-4 py-2 rounded-xl font-bold cursor-pointer text-center block">
              Zarejestruj się
            </span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 mt-8 md:flex-row md:gap-16 md:p-8">
        <div className="max-w-xl text-center">
          <h2 className="text-[clamp(2rem,5vw,3rem)] text-[#f49361] mb-4 font-semibold">
            Adoptuj przyjaciela na całe życie
          </h2>
          <p className="text-[clamp(1rem,2.5vw,1.4rem)] mb-6">
            Dzięki Petfinity łatwiej odnajdziesz futrzastego przyjaciela
            idealnie dopasowanego do Twoich preferencji.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => Router.replace(`${API_BASE_URL}/auth/google`)}
              className="bg-white text-[#333] border border-[#ccc] rounded-lg px-4 py-2 text-base flex items-center gap-2 hover:bg-[#f0f0f0]"
            >
              <Image
                src={googleLogo}
                alt="Google icon"
                width={20}
                height={20}
              />
              Zaloguj się z Google
            </button>
          </div>
        </div>

        <div className="max-w-[500px] w-full shrink-0 mt-8 md:mt-0">
          <Image
            src={img}
            alt="dziewczyna ze zwierzakami"
            className="w-full h-auto rounded-xl"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center bg-[#fff4f3] px-10 py-24 gap-16 min-h-screen text-center md:text-left flex-wrap">
        <div className="max-w-xl">
          <h2 className="text-4xl text-[#e57a23] mb-6 font-semibold">
            Poznaj Petfinity
          </h2>
          <p className="text-[clamp(1rem,2vw,1.2rem)] text-[#333] mb-4 leading-relaxed">
            Petfinity powstało z miłości do zwierząt i potrzeby tworzenia
            prawdziwych, wartościowych relacji między ludźmi a ich przyszłymi
            pupilami.
          </p>
          <p className="text-[clamp(1rem,2vw,1.2rem)] text-[#333] mb-4 leading-relaxed">
            Naszą misją jest uproszczenie procesu adopcji, tak by był on
            bardziej przemyślany i lepiej dopasowany do Twoich potrzeb oraz
            stylu życia. Wierzymy, że każde zwierzę zasługuje na kochający dom,
            a każda osoba — na wiernego towarzysza.
          </p>
          <p className="text-[clamp(1rem,2vw,1.2rem)] text-[#333] mb-4 leading-relaxed">
            Dzięki naszemu zaawansowanemu systemowi dopasowań oraz intuicyjnemu
            interfejsowi możesz z łatwością przeglądać profile zwierząt i
            znajdować tych pupili, którzy najlepiej odpowiadają Twoim
            oczekiwaniom i możliwościom.
          </p>
          <p className="text-[clamp(1rem,2vw,1.2rem)] text-[#333] mb-12 leading-relaxed">
            Nasza platforma to dopiero początek — budujemy przestrzeń, która z
            czasem stanie się centrum adopcji pełnym empatii, zaufania i radości
            ze wspólnego życia.
          </p>
          <Link
            href="/registerPage"
            className="mt-20 bg-[#f98f48] hover:bg-[#e8803e] text-white px-6 py-3 rounded-2xl cursor-pointer text-lg transition duration-300"
          >
            Dołącz do Petfinity
          </Link>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <div className="shrink-0">
            <img
              src="https://media1.tenor.com/m/EE6KCl3SJ5gAAAAC/%D9%83%D8%B3%D9%85%D9%83-cats.gif"
              alt="kotek"
              className="max-w-full h-auto"
            />
          </div>

          <div className="mt-8 text-base text-[#444]">
            <p className="mb-2">
              <strong>Nasza misja:</strong>
              <br />
              Chcemy sprawić, aby proces adopcji był łatwy, świadomy i pełen
              miłości 🧡
            </p>
            <p className="font-semibold">Nasze wartości:</p>
            <ul className="list-none mt-2 mb-6">
              <li className="mb-1">🐶 Empatia</li>
              <li className="mb-1">🤝 Zaufanie</li>
              <li className="mb-1">🧡 Odpowiedzialność</li>
              <li className="mb-1">🧍‍♀️ Partnerstwo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
