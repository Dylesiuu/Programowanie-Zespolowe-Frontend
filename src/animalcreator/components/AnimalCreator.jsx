import React, { useState, useRef, useContext, useEffect } from 'react';
import AnimalStartScreen from './AnimalStartScreen';
import AnimalCompletionScreen from './AnimalCompletionScreen';
import animalQuestions from '../data/animalQuestions';
import Question from '../../creator/components/Question';
import NavigationButton from '../../creator/components/NavigationButton';
import { useRouter } from 'next/router';
import AnimalDetailScreen from './AnimalDetailScreen';
import { UserContext } from '@/context/userContext';
import { useAuthFetch } from '@/lib/authFetch';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AnimalCreator = ({ givenAnimalId }) => {
  const router = useRouter();
  const fileInputRef = useRef();
  const userContext = useContext(UserContext);
  const fetchData = useAuthFetch();
  const [allTraits, setAllTraits] = useState([]);
  const currentDate = new Date().toISOString().split('T')[0];
  const [currentStep, setCurrentStep] = useState('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const STARTING_QUESTION_INDEX = 3;
  const MAX_PHOTOS = 50;
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successfullyAdded, setSuccessfullyAdded] = useState(false);

  const [animalData, setAnimalData] = useState({
    type: '',
    name: '',
    birthDate: '',
    gender: '',
    tags: [],
    description: '',
    photos: [],
    registrationNumber: '',
  });

  const preparedQuestions = animalQuestions.map((question) => {
    const questionTraits = allTraits.filter(
      (trait) => trait.collectionId === question.id
    );

    return {
      ...question,
      options: questionTraits.map((trait) => ({
        text: trait.text,
        tags: [trait._id],
        conflicts: trait.conflicts,
      })),
    };
  });

  const handleStart = (animalType) => {
    setAnimalData((prev) => ({
      ...prev,
      type: animalType == 'pies',
    }));
    if (!givenAnimalId && givenAnimalId === 'null') {
      setSelectedTags([]);
    } else {
      setSelectedTags(animalData.tags);
    }
    setCurrentStep('basicInfo');
  };

  const handleOptionClick = (optionTags) => {
    setSelectedTags((prevTags) => {
      const clickedTagId = optionTags[0];
      const clickedTrait = allTraits.find((t) => t._id === clickedTagId);

      const isSelected = prevTags.some((tag) => tag._id === clickedTagId);
      if (isSelected) {
        return prevTags.filter((tag) => tag._id !== clickedTagId);
      }

      const conflicts = clickedTrait?.conflicts || [];
      const filteredTags = prevTags.filter(
        (tag) => !conflicts.includes(tag._id)
      );

      return [...filteredTags, clickedTrait];
    });
  };

  const handleNext = () => {
    if (currentStep === 'basicInfo') {
      if (!animalData.name.trim()) {
        alert('Proszę podać imię zwierzęcia');
        return;
      }
      if (!animalData.birthDate) {
        alert('Proszę podać datę urodzenia');
        return;
      }
      if (!animalData.gender) {
        alert('Proszę wybrać płeć');
        return;
      }
      if (!animalData.registrationNumber.trim()) {
        alert('Proszę podać numer ewidencyjny');
        return;
      }
      setCurrentStep('questions');
      setCurrentQuestionIndex(STARTING_QUESTION_INDEX);
    } else if (currentStep === 'questions') {
      if (currentQuestionIndex < preparedQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCurrentStep('details');
      }
    } else if (currentStep === 'details') {
      setCurrentStep('completion');
    }
  };

  const handleBackFromDetails = () => {
    setCurrentStep('questions');
    setCurrentQuestionIndex(preparedQuestions.length - 1);
  };

  const handlePrevious = () => {
    if (currentStep === 'basicInfo') {
      // setAnimalData({
      //   type: '',
      //   name: '',
      //   birthDate: '',
      //   gender: '',
      //   tags: [],
      //   description: '',
      //   photos: [],
      //   registrationNumber: '',
      // });
      setCurrentStep('start');
    } else if (currentStep === 'questions') {
      if (currentQuestionIndex === 3) {
        setCurrentStep('basicInfo');
      } else {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    } else if (currentStep === 'details') {
      setCurrentStep('questions');
      setCurrentQuestionIndex(preparedQuestions.length - 1);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + animalData.photos.length > MAX_PHOTOS) {
      return;
    }
    const photosWithPreview = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setAnimalData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...photosWithPreview],
    }));
  };

  const removePhoto = async (preview) => {
    setAnimalData((prev) => {
      const newPhotos = prev.photos.filter(
        (photo) => photo.preview !== preview
      );
      const removedPhoto = prev.photos.find(
        (photo) => photo.preview === preview
      );
      if (removedPhoto) {
        URL.revokeObjectURL(removedPhoto.preview);
        if (removedPhoto.publicId) {
          fetchRemovePhoto(removedPhoto);
        }
      }
      return { ...prev, photos: newPhotos };
    });
  };

  const fetchRemovePhoto = async (toRemove) => {
    try {
      const publicIds = Array.isArray(toRemove)
        ? toRemove.map((item) => item.publicId)
        : [toRemove.publicId];

      const response = await fetchData(`${API_BASE_URL}/images`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userContext.token}`,
        },
        body: JSON.stringify({
          publicIds,
        }),
      });

      if (response.ok) {
        console.log('Photo(s) removed successfully');
      } else {
        console.error('Failed to remove photo(s) from backend');
      }
    } catch (error) {
      console.error('Error removing photo(s) from backend:', error);
    }
  };

  const handleDescriptionChange = (e) => {
    setAnimalData((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formData = {
        type: animalData.type,
        name: animalData.name,
        birthYear: new Date(animalData.birthDate).getFullYear(),
        birthMonth: new Date(animalData.birthDate).getMonth() + 1,
        gender: animalData.gender,
        description: animalData.description,
        traits: selectedTags.map((tag) => tag._id),
        images: await uploadPhotos(animalData.photos),
        registrationNumber: animalData.registrationNumber,
      };

      let url;
      let method;

      if (
        givenAnimalId &&
        givenAnimalId !== 'null' &&
        givenAnimalId !== 'undefined'
      ) {
        url = `${API_BASE_URL}/animals/edit/${givenAnimalId}`;
        method = 'PATCH';
      } else {
        url = `${API_BASE_URL}/animals/add`;
        method = 'POST';
      }

      const response = await fetchData(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log('Response:', response);

      if (response.ok) {
        setSuccessfullyAdded(true);
        setTimeout(() => {
          router.push(
            `/shelterProfilePage?shelterId=${userContext.user.shelterId}&animal=null`
          );
        }, 1500);
      } else {
        console.error('Wystąpił błąd');
        fetchRemovePhoto(animalData.photos);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting/adding animal:', error);
      fetchRemovePhoto(animalData.photos);
      alert('Wystąpił błąd podczas dodawania/edytowania zwierzęcia');
      setIsSubmitting(false);
    }
  };

  const fetchAnimalData = async (id) => {
    try {
      const response = await fetchData(`${API_BASE_URL}/animals/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userContext.token}`,
        },
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }

      const data = await response.json();

      setAnimalData({
        type: data.type,
        name: data.name,
        birthDate: `${data.birthYear}-${String(data.birthMonth).padStart(2, '0')}-01`,
        gender: data.gender,
        tags: data.traits,
        description: data.description,
        photos: data.images,
      });
      setSelectedTags(data.traits);
      setCurrentStep('basicInfo');
    } catch (error) {
      console.error('Error fetching animal data:', error.message);
    }
  };

  useEffect(() => {
    if (givenAnimalId && givenAnimalId !== 'null') {
      fetchAnimalData(givenAnimalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [givenAnimalId]);

  const uploadPhotos = async (photos) => {
    const newPhotos = photos.filter((photo) => photo.file);
    const existingPhotos = photos.filter((photo) => !photo.file);

    let uploadedPhotos = [];
    if (newPhotos.length > 0) {
      const formData = new FormData();
      newPhotos.forEach((photo) => {
        formData.append('files', photo.file);
      });
      try {
        const response = await fetchData(
          `${API_BASE_URL}/images/uploadAnimal`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${userContext.token}`,
            },
            body: formData,
          }
        );
        if (!response.ok) {
          console.error('Failed to upload photos');
        }
        const data = await response.json();
        uploadedPhotos = data.map((photo) => ({
          publicId: photo.publicId,
          preview: photo.url,
        }));
      } catch (error) {
        console.error('Error uploading photos:', error);
        alert('Wystąpił błąd podczas przesyłania zdjęć');
      }
    }

    return [
      ...uploadedPhotos,
      ...existingPhotos.map((photo) => ({
        publicId: photo.publicId,
        preview: photo.preview,
      })),
    ];
  };

  useEffect(() => {
    const fetchAllTraits = async () => {
      try {
        const response = await fetchData(
          `${API_BASE_URL}/animals/getAllAnimalTraits`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${userContext.token}`,
            },
            body: JSON.stringify(),
          }
        );

        if (!response.ok) {
          console.error('Failed to fetch traits:');
        }

        const data = await response.json();
        console.log('Fetched traits:', data);
        setAllTraits(data.traits);
      } catch (error) {
        console.error('Error fetching traits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTraits();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Ładowanie...
      </div>
    );
  }

  if (currentStep === 'start') {
    return (
      <AnimalStartScreen
        onStart={handleStart}
        onSkip={() =>
          router.push(
            `/shelterProfilePage?shelterId=${userContext.user.shelterId}&animal=null`
          )
        }
      />
    );
  }

  if (currentStep === 'basicInfo') {
    return (
      <div className="flex flex-col justify-center min-h-screen bg-[url('/Union.svg')] bg-repeat bg-[length:150rem_100rem] bg-[#FFF0E9]">
        <div className="mx-auto p-6 w-full max-w-6xl flex-grow flex flex-col">
          <div className="flex-grow flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto flex flex-col items-center bg-[#FFF9F5]/70 rounded-4xl shadow-lg p-8">
              <h1 className="text-[#C9590F] text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-6 md:mb-10 text-center">
                Podstawowe informacje
              </h1>

              <div className="w-full max-w-[350px] space-y-6">
                <div>
                  <label className="block text-[#C9590F] mb-2">
                    Jak nazywa się zwierzę?
                  </label>
                  <input
                    type="text"
                    value={animalData.name}
                    onChange={(e) =>
                      setAnimalData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full p-4 border-2 border-[#CE8455] rounded-3xl bg-[#fefaf7] hover:bg-[#f0e6dc] focus:outline-none focus:ring-2 focus:ring-[#CE8455] transition-all"
                    placeholder="Wpisz imię zwierzęcia"
                  />
                </div>
                <div>
                  <label
                    htmlFor="registrationNumber"
                    className="block text-[#C9590F] mb-2"
                  >
                    Numer ewidencyjny
                  </label>
                  <input
                    id="registrationNumber"
                    type="text"
                    value={animalData.registrationNumber}
                    onChange={(e) =>
                      setAnimalData((prev) => ({
                        ...prev,
                        registrationNumber: e.target.value,
                      }))
                    }
                    className="w-full p-4 border-2 border-[#CE8455] rounded-3xl bg-[#fefaf7] hover:bg-[#f0e6dc] focus:outline-none focus:ring-2 focus:ring-[#CE8455] transition-all"
                    placeholder="Wpisz numer ewidencyjny"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="birthDate"
                    className="block text-[#C9590F] mb-2"
                  >
                    Szacowana data urodzenia zwierzęcia
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    value={animalData.birthDate}
                    onChange={(e) =>
                      setAnimalData((prev) => ({
                        ...prev,
                        birthDate: e.target.value,
                      }))
                    }
                    className="w-full p-4 border-2 border-[#CE8455] rounded-3xl bg-[#fefaf7] hover:bg-[#f0e6dc] focus:outline-none focus:ring-2 focus:ring-[#CE8455] transition-all"
                    max={currentDate}
                    min="1990-01-01"
                  />
                </div>

                <div>
                  <label className="block text-[#C9590F] mb-2">
                    Jaka jest płeć zwierzęcia?
                  </label>
                  <div className="flex flex-wrap justify-center gap-4">
                    {['Samiec', 'Samica'].map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setAnimalData((prev) => ({ ...prev, gender: option }))
                        }
                        className={`py-3 px-6 rounded-3xl border-1 transition-all
                                  w-full max-w-[150px]
                                  ${
                                    animalData.gender === option
                                      ? 'bg-[#CE8455] text-white hover:bg-[#AA673C]'
                                      : 'bg-[#fefaf7] hover:bg-[#f0e6dc] text-[#CE8455] border-[#CE8455]'
                                  }
                                  hover:scale-105 active:scale-95`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6 w-full max-w-4xl mx-auto">
            <NavigationButton
              onNext={handleNext}
              onPrevious={handlePrevious}
              isLast={false}
            />
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'details') {
    return (
      <AnimalDetailScreen
        animalData={animalData}
        onDescriptionChange={handleDescriptionChange}
        onPhotoUpload={handlePhotoUpload}
        onRemovePhoto={removePhoto}
        onNext={handleNext}
        onBack={handleBackFromDetails}
        fileInputRef={fileInputRef}
      />
    );
  }

  if (currentStep === 'completion') {
    return (
      <AnimalCompletionScreen
        animalData={animalData}
        onSubmit={handleSubmit}
        onBack={() => setCurrentStep('details')}
        isSubmitting={isSubmitting}
        selectedTags={selectedTags}
        success={successfullyAdded}
      />
    );
  }

  const currentQuestion = preparedQuestions[currentQuestionIndex];
  return (
    <div className="flex flex-col justify-center h-[calc(100vh-3.75rem)] min-h-screen">
      <div className="mx-auto p-6 w-full max-w-6xl flex-grow flex flex-col">
        <div className="flex-grow flex flex-col justify-center">
          <Question
            question={currentQuestion}
            selectedTags={selectedTags}
            onOptionClick={handleOptionClick}
          />
        </div>
        <div className="flex justify-between pt-6 w-full max-w-4xl mx-auto">
          <NavigationButton
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLast={currentQuestionIndex === preparedQuestions.length - 1}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimalCreator;
