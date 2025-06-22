import React, { useState, useEffect } from 'react';
import { ChevronRightIcon, ChevronLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const AdvancedInteractivePost = ({ config }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userChoices, setUserChoices] = useState({});
  const [gameState, setGameState] = useState(config.initialState || {});
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Calculate derived values based on current game state
  const calculateDerivedValues = () => {
    const derived = { ...gameState };
    
    // Calculate net worth
    if (derived.assets && derived.debt) {
      derived.netWorth = derived.assets - derived.debt;
    }
    
    // Calculate monthly cash flow
    if (derived.income && derived.expenses) {
      derived.monthlyCashFlow = derived.income - derived.expenses;
    }
    
    // Calculate retirement savings projection
    if (derived.monthlySavings && derived.investmentReturn && derived.yearsToRetirement) {
      const monthlyRate = derived.investmentReturn / 12;
      const months = derived.yearsToRetirement * 12;
      derived.retirementSavings = derived.monthlySavings * 
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }
    
    return derived;
  };

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
        } else if (operation === 'subtract') {
          newGameState[key] = (newGameState[key] || 0) - value;
        }
      });
    }
    setGameState(newGameState);
  };

  const nextStep = () => {
    if (currentStep < config.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
      setShowResults(true);
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
    setGameState(config.initialState || {});
    setIsComplete(false);
    setShowResults(false);
  };

  const currentStepData = config.steps[currentStep];
  const progress = ((currentStep + 1) / config.steps.length) * 100;
  const derivedValues = calculateDerivedValues();

  // Visual representation of financial state
  const FinancialMeter = ({ label, value, maxValue, color = "indigo" }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">{label}</span>
          <span className="font-bold">${value?.toLocaleString() || 0}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`bg-${color}-600 h-3 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  if (showResults) {
    return (
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Financial Journey Complete!</h2>
          <p className="text-xl text-gray-600">Here's how your choices shaped your financial future</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Financial Summary */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Net Worth:</span>
                <span className={`text-2xl font-bold ${derivedValues.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${derivedValues.netWorth?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Monthly Cash Flow:</span>
                <span className={`text-xl font-bold ${derivedValues.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${derivedValues.monthlyCashFlow?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Retirement Savings:</span>
                <span className="text-xl font-bold text-blue-600">
                  ${derivedValues.retirementSavings?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Choice Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Choices</h3>
            <div className="space-y-3">
              {Object.entries(userChoices).map(([stepIndex, choice]) => (
                <div key={stepIndex} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <span className="font-medium text-sm text-gray-600">
                      {config.steps[parseInt(stepIndex)].title}:
                    </span>
                    <p className="font-semibold text-gray-900">{choice.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Meters */}
        <div className="bg-white border rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Financial Health Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FinancialMeter 
              label="Assets" 
              value={derivedValues.assets || 0} 
              maxValue={Math.max(derivedValues.assets || 0, 100000)} 
              color="green" 
            />
            <FinancialMeter 
              label="Debt" 
              value={derivedValues.debt || 0} 
              maxValue={Math.max(derivedValues.debt || 0, 100000)} 
              color="red" 
            />
            <FinancialMeter 
              label="Monthly Income" 
              value={derivedValues.income || 0} 
              maxValue={Math.max(derivedValues.income || 0, 10000)} 
              color="blue" 
            />
            <FinancialMeter 
              label="Monthly Expenses" 
              value={derivedValues.expenses || 0} 
              maxValue={Math.max(derivedValues.expenses || 0, 10000)} 
              color="orange" 
            />
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetGame}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
        <p className="text-indigo-100">{config.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-100 h-3">
        <div 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Current Financial State (if available) */}
      {Object.keys(gameState).length > 0 && (
        <div className="bg-gray-50 p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Financial State</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {derivedValues.netWorth !== undefined && (
              <div className="text-center">
                <div className={`text-2xl font-bold ${derivedValues.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${derivedValues.netWorth?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Net Worth</div>
              </div>
            )}
            {derivedValues.monthlyCashFlow !== undefined && (
              <div className="text-center">
                <div className={`text-xl font-bold ${derivedValues.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${derivedValues.monthlyCashFlow?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Monthly Cash Flow</div>
              </div>
            )}
            {gameState.income && (
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  ${gameState.income?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Monthly Income</div>
              </div>
            )}
            {gameState.expenses && (
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">
                  ${gameState.expenses?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Monthly Expenses</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            Step {currentStep + 1} of {config.steps.length}
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentStepData.title}</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">{currentStepData.description}</p>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {currentStepData.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoice(choice)}
              className={`p-6 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-lg ${
                userChoices[currentStep] === choice
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">{choice.title}</h3>
              <p className="text-gray-600 mb-4">{choice.description}</p>
              {choice.effects && (
                <div className="space-y-2">
                  {choice.effects.map((effect, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-3 ${
                        effect.value > 0 ? 'bg-green-500' : effect.value < 0 ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-sm text-gray-700">{effect.description}</span>
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
            {currentStep + 1} of {config.steps.length}
          </div>

          <button
            onClick={nextStep}
            disabled={!userChoices[currentStep]}
            className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
              !userChoices[currentStep]
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {currentStep === config.steps.length - 1 ? 'See Results' : 'Next'}
            <ChevronRightIcon className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedInteractivePost; 