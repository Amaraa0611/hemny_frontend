import React, { useState, useEffect } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

const InteractiveBlogPost = ({ steps = [], title, description }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userChoices, setUserChoices] = useState({});
  const [gameState, setGameState] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  const handleChoice = (choice) => {
    const newChoices = { ...userChoices, [currentStep]: choice };
    setUserChoices(newChoices);
    
    // Update game state based on choice
    const newGameState = { ...gameState };
    if (choice.affects) {
      choice.affects.forEach(({ key, value, operation = 'set' }) => {
        if (operation === 'set') {
          newGameState[key] = value;
        } else if (operation === 'add') {
          newGameState[key] = (newGameState[key] || 0) + value;
        } else if (operation === 'multiply') {
          newGameState[key] = (newGameState[key] || 1) * value;
        }
      });
    }
    setGameState(newGameState);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetGame = () => {
    setCurrentStep(0);
    setUserChoices({});
    setGameState({});
    setIsComplete(false);
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Complete!</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-green-800 mb-2">Your Results</h3>
            <div className="space-y-2 text-left">
              {Object.entries(gameState).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={resetGame}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-indigo-100">{description}</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-100 h-2">
        <div 
          className="bg-indigo-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Content */}
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentStepData.title}</h2>
          <p className="text-gray-600 text-lg">{currentStepData.description}</p>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentStepData.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoice(choice)}
              className={`p-6 border-2 rounded-lg text-left transition-all duration-200 hover:shadow-md ${
                userChoices[currentStep] === choice
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <h3 className="font-semibold text-gray-900 mb-2">{choice.title}</h3>
              <p className="text-gray-600 text-sm">{choice.description}</p>
              {choice.effects && (
                <div className="mt-3 text-xs text-gray-500">
                  {choice.effects.map((effect, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        effect.value > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      {effect.description}
                    </div>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeftIcon className="w-5 h-5 mr-1" />
            Previous
          </button>

          <div className="text-sm text-gray-500">
            {currentStep + 1} of {steps.length}
          </div>

          <button
            onClick={nextStep}
            disabled={!userChoices[currentStep]}
            className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
              !userChoices[currentStep]
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            <ChevronRightIcon className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveBlogPost; 