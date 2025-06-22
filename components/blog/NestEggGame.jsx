import React, { useState, useEffect } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const NestEggGame = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userChoices, setUserChoices] = useState({});
  const [gameState, setGameState] = useState({
    age: 22,
    year: 2010,
    assets: 0,
    debt: 0,
    income: 0,
    expenses: 0,
    retirementSavings: 0,
    monthlySavings: 0,
    savingsRate: 0,
    yearsToRetirement: 40,
    investmentReturn: 0.05,
    isMarried: false,
    hasChildren: false,
    hasHouse: false,
    isFried: false
  });
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const gameSteps = [
    {
      title: "Your Job",
      description: "You've just graduated college in 2010 at age 22. What's your first career move?",
      choices: [
        {
          title: "Corporate Job",
          description: "Join a large company with stable income",
          effects: [
            { description: "Starting salary: $45,000/year", value: 1 },
            { description: "Health insurance included", value: 1 }
          ],
          affects: [
            { key: "income", value: 3750, operation: "set" },
            { key: "expenses", value: 2000, operation: "set" },
            { key: "monthlySavings", value: 1750, operation: "set" }
          ]
        },
        {
          title: "Startup",
          description: "Take a risk with a smaller company",
          effects: [
            { description: "Starting salary: $35,000/year", value: -1 },
            { description: "Equity options available", value: 1 }
          ],
          affects: [
            { key: "income", value: 2917, operation: "set" },
            { key: "expenses", value: 1800, operation: "set" },
            { key: "monthlySavings", value: 1117, operation: "set" }
          ]
        }
      ]
    },
    {
      title: "Living Situation",
      description: "Where will you live after graduation?",
      choices: [
        {
          title: "Rent an Apartment",
          description: "Move into your own place",
          effects: [
            { description: "Monthly rent: $1,200", value: -1 },
            { description: "Full independence", value: 1 }
          ],
          affects: [
            { key: "expenses", value: 1200, operation: "add" },
            { key: "monthlySavings", value: -1200, operation: "add" }
          ]
        },
        {
          title: "Live with Parents",
          description: "Save money by staying at home",
          effects: [
            { description: "Save $1,200/month", value: 1 },
            { description: "Less independence", value: -1 }
          ],
          affects: [
            { key: "expenses", value: -1200, operation: "add" },
            { key: "monthlySavings", value: 1200, operation: "add" }
          ]
        }
      ]
    },
    {
      title: "Savings Rate",
      description: "How much of your income will you save?",
      choices: [
        {
          title: "Conservative (5%)",
          description: "Save a small portion for emergencies",
          effects: [
            { description: "Monthly savings: $187", value: 1 },
            { description: "More spending money", value: 1 }
          ],
          affects: [
            { key: "savingsRate", value: 0.05, operation: "set" },
            { key: "monthlySavings", value: 187, operation: "set" }
          ]
        },
        {
          title: "Aggressive (20%)",
          description: "Save aggressively for early financial freedom",
          effects: [
            { description: "Monthly savings: $750", value: 1 },
            { description: "Less spending money", value: -1 }
          ],
          affects: [
            { key: "savingsRate", value: 0.20, operation: "set" },
            { key: "monthlySavings", value: 750, operation: "set" }
          ]
        }
      ]
    },
    {
      title: "Major Purchase",
      description: "You've saved some money. What's your next big purchase?",
      choices: [
        {
          title: "Buy a Car",
          description: "Purchase a reliable vehicle for $25,000",
          effects: [
            { description: "Immediate transportation", value: 1 },
            { description: "Monthly payment: $400", value: -1 }
          ],
          affects: [
            { key: "assets", value: 25000, operation: "add" },
            { key: "debt", value: 25000, operation: "add" },
            { key: "expenses", value: 400, operation: "add" },
            { key: "monthlySavings", value: -400, operation: "add" }
          ]
        },
        {
          title: "Invest in Education",
          description: "Take courses to advance your career",
          effects: [
            { description: "Career advancement potential", value: 1 },
            { description: "Cost: $15,000", value: -1 }
          ],
          affects: [
            { key: "assets", value: -15000, operation: "add" },
            { key: "income", value: 500, operation: "add" },
            { key: "monthlySavings", value: 500, operation: "add" }
          ]
        }
      ]
    },
    {
      title: "Marriage Decision",
      description: "You're 28 now. Will you get married?",
      choices: [
        {
          title: "Get Married",
          description: "Tie the knot with your partner",
          effects: [
            { description: "Wedding cost: $25,000", value: -1 },
            { description: "Double income potential", value: 1 }
          ],
          affects: [
            { key: "assets", value: -25000, operation: "add" },
            { key: "income", value: 3750, operation: "add" },
            { key: "monthlySavings", value: 3750, operation: "add" },
            { key: "isMarried", value: true, operation: "set" }
          ]
        },
        {
          title: "Stay Single",
          description: "Focus on your career and personal growth",
          effects: [
            { description: "No wedding expenses", value: 1 },
            { description: "Single income", value: -1 }
          ],
          affects: [
            { key: "isMarried", value: false, operation: "set" }
          ]
        }
      ]
    },
    {
      title: "Housing Decision",
      description: "You're 30. Time to think about housing?",
      choices: [
        {
          title: "Buy a House",
          description: "Purchase a home for $300,000",
          effects: [
            { description: "20% down payment: $60,000", value: -1 },
            { description: "Monthly mortgage: $1,200", value: -1 },
            { description: "Home appreciation potential", value: 1 }
          ],
          affects: [
            { key: "assets", value: -60000, operation: "add" },
            { key: "debt", value: 240000, operation: "add" },
            { key: "expenses", value: 1200, operation: "add" },
            { key: "monthlySavings", value: -1200, operation: "add" },
            { key: "hasHouse", value: true, operation: "set" }
          ]
        },
        {
          title: "Continue Renting",
          description: "Keep renting and stay flexible",
          effects: [
            { description: "No down payment needed", value: 1 },
            { description: "No home equity", value: -1 }
          ],
          affects: [
            { key: "hasHouse", value: false, operation: "set" }
          ]
        }
      ]
    },
    {
      title: "Children Decision",
      description: "You're 32. Will you have children?",
      choices: [
        {
          title: "Have a Child",
          description: "Start a family",
          effects: [
            { description: "Childcare costs: 17% of income", value: -1 },
            { description: "Family tax benefits", value: 1 }
          ],
          affects: [
            { key: "expenses", value: 1275, operation: "add" },
            { key: "monthlySavings", value: -1275, operation: "add" },
            { key: "hasChildren", value: true, operation: "set" }
          ]
        },
        {
          title: "No Children",
          description: "Focus on career and personal goals",
          effects: [
            { description: "No childcare costs", value: 1 },
            { description: "More disposable income", value: 1 }
          ],
          affects: [
            { key: "hasChildren", value: false, operation: "set" }
          ]
        }
      ]
    },
    {
      title: "Investment Strategy",
      description: "How will you invest your savings?",
      choices: [
        {
          title: "Conservative (Bonds)",
          description: "60% bonds, 40% stocks - lower risk",
          effects: [
            { description: "Expected return: 6% annually", value: 1 },
            { description: "Lower volatility", value: 1 }
          ],
          affects: [
            { key: "investmentReturn", value: 0.06, operation: "set" }
          ]
        },
        {
          title: "Aggressive (Stocks)",
          description: "90% stocks, 10% bonds - higher risk",
          effects: [
            { description: "Expected return: 10% annually", value: 1 },
            { description: "Higher volatility", value: -1 }
          ],
          affects: [
            { key: "investmentReturn", value: 0.10, operation: "set" }
          ]
        }
      ]
    },
    {
      title: "Retirement Planning",
      description: "You're 45. How much will you withdraw in retirement?",
      choices: [
        {
          title: "Conservative (3%)",
          description: "Withdraw 3% annually for safety",
          effects: [
            { description: "Lower withdrawal rate", value: 1 },
            { description: "Less retirement income", value: -1 }
          ],
          affects: [
            { key: "withdrawalRate", value: 0.03, operation: "set" }
          ]
        },
        {
          title: "Standard (4%)",
          description: "Withdraw 4% annually (traditional rule)",
          effects: [
            { description: "Standard withdrawal rate", value: 1 },
            { description: "Moderate retirement income", value: 1 }
          ],
          affects: [
            { key: "withdrawalRate", value: 0.04, operation: "set" }
          ]
        }
      ]
    },
    {
      title: "Final Years",
      description: "You're 62. Time to retire and see how you did!",
      choices: [
        {
          title: "Retire Now",
          description: "Start your retirement journey",
          effects: [
            { description: "Calculate your nest egg", value: 1 }
          ],
          affects: [
            { key: "retirementAge", value: 62, operation: "set" }
          ]
        }
      ]
    }
  ];

  const calculateRetirementSavings = () => {
    const { monthlySavings, investmentReturn, yearsToRetirement } = gameState;
    if (!monthlySavings || !investmentReturn || !yearsToRetirement) return 0;
    
    const monthlyRate = investmentReturn / 12;
    const months = yearsToRetirement * 12;
    return monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  };

  const calculateNetWorth = () => {
    const { assets, debt } = gameState;
    return (assets || 0) - (debt || 0);
  };

  const calculateMonthlyCashFlow = () => {
    const { income, expenses } = gameState;
    return (income || 0) - (expenses || 0);
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
        }
      });
    }
    
    // Update age and year
    if (currentStep < gameSteps.length - 1) {
      newGameState.age += 2;
      newGameState.year += 2;
    }
    
    setGameState(newGameState);
  };

  const nextStep = () => {
    if (currentStep < gameSteps.length - 1) {
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
    setGameState({
      age: 22,
      year: 2010,
      assets: 0,
      debt: 0,
      income: 0,
      expenses: 0,
      retirementSavings: 0,
      monthlySavings: 0,
      savingsRate: 0,
      yearsToRetirement: 40,
      investmentReturn: 0.05,
      isMarried: false,
      hasChildren: false,
      hasHouse: false,
      isFried: false
    });
    setIsComplete(false);
    setShowResults(false);
  };

  const currentStepData = gameSteps[currentStep];
  const progress = ((currentStep + 1) / gameSteps.length) * 100;
  const netWorth = calculateNetWorth();
  const monthlyCashFlow = calculateMonthlyCashFlow();
  const retirementSavings = calculateRetirementSavings();

  // Determine if the egg gets fried
  const isFried = netWorth < -50000 || (gameState.age >= 62 && retirementSavings < 500000);

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">The Nest Egg Game</h1>
            <p className="text-xl text-gray-600">Your financial journey is complete!</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              {isFried ? (
                <div className="text-red-600">
                  <div className="text-6xl mb-4">🍳</div>
                  <h2 className="text-3xl font-bold mb-2">Your Egg Got Fried!</h2>
                  <p className="text-lg">Unfortunately, your financial decisions led to some challenges.</p>
                </div>
              ) : (
                <div className="text-green-600">
                  <div className="text-6xl mb-4">🥚</div>
                  <h2 className="text-3xl font-bold mb-2">Your Nest Egg Survived!</h2>
                  <p className="text-lg">Congratulations! You made it through without getting fried.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netWorth.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Net Worth</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${monthlyCashFlow.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Monthly Cash Flow</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ${retirementSavings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Retirement Savings</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Life Choices</h3>
              <div className="space-y-3">
                {Object.entries(userChoices).map(([stepIndex, choice]) => (
                  <div key={stepIndex} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <span className="font-medium text-sm text-gray-600">
                        {gameSteps[parseInt(stepIndex)].title}:
                      </span>
                      <p className="font-semibold text-gray-900">{choice.title}</p>
                    </div>
                  </div>
                ))}
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">The Nest Egg Game</h1>
          <p className="text-lg text-gray-600 mb-4">
            Make money • Go into debt • Buy stuff • Get fried
          </p>
          <p className="text-sm text-gray-500">
            Published Sept. 16, 2019 at 9:30 a.m. ET
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-gray-100 h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Current State */}
          <div className="bg-yellow-50 p-6 border-b">
            <div className="flex items-center justify-center mb-4">
              <div className="text-4xl mr-4">🥚</div>
              <div>
                <div className="text-lg font-semibold">Age: {gameState.age} • Year: {gameState.year}</div>
                <div className="text-sm text-gray-600">Step {currentStep + 1} of {gameSteps.length}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className={`text-xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netWorth.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Net Worth</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${monthlyCashFlow.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Monthly Cash Flow</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  ${retirementSavings.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Retirement Savings</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-600">
                  {gameState.isMarried ? '👫' : '👤'}
                </div>
                <div className="text-xs text-gray-600">
                  {gameState.isMarried ? 'Married' : 'Single'}
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentStepData.title}</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">{currentStepData.description}</p>
            </div>

            {/* Choices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {currentStepData.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className={`p-6 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-lg ${
                    userChoices[currentStep] === choice
                      ? 'border-yellow-500 bg-yellow-50 shadow-md'
                      : 'border-gray-200 hover:border-yellow-300'
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
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                ← Previous
              </button>

              <div className="text-sm text-gray-500">
                {currentStep + 1} of {gameSteps.length}
              </div>

              <button
                onClick={nextStep}
                disabled={!userChoices[currentStep]}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  !userChoices[currentStep]
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                }`}
              >
                {currentStep === gameSteps.length - 1 ? 'See Results' : 'Next →'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>This game is part of the Journal's "The New Rules of Money" package about the financial challenges facing young adults.</p>
          <p className="mt-2">Navigating life's financial decisions can be hard.</p>
        </div>
      </div>
    </div>
  );
};

export default NestEggGame; 