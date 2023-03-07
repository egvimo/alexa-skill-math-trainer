// @ts-check

const DIFFICULTY_LEVEL = {
  VERY_EASY: {
    upperLimit: 10,
    operators: ["ADDITION"],
  },
  EASY: {
    upperLimit: 20,
    operators: ["ADDITION", "SUBTRACTION"],
  },
  MEDIUM: {
    upperLimit: 100,
    operators: ["ADDITION", "SUBTRACTION", "MULTIPLICATION"],
  },
  DIFFICULT: {
    upperLimit: 100,
    operators: ["ADDITION", "SUBTRACTION", "MULTIPLICATION", "DIVISION"],
  },
  VERY_DIFFICULT: {
    upperLimit: 1000,
    operators: ["ADDITION", "SUBTRACTION", "MULTIPLICATION", "DIVISION"],
  },
};

const start = function (handlerInput) {
  const requestAttributes =
    handlerInput.attributesManager.getRequestAttributes();
  let speechOutput =
    requestAttributes.t("WELCOME_MESSAGE", requestAttributes.t("GAME_NAME")) +
    requestAttributes.t("NEW_GAME_MESSAGE");

  const exercise = createExercise(handlerInput);

  const repromptText = formulateQuestion(handlerInput, exercise);

  speechOutput += repromptText;

  initExerciseInSession(handlerInput, exercise);

  return handlerInput.responseBuilder
    .speak(speechOutput)
    .reprompt(repromptText)
    .getResponse();
};

const handleAnswer = function (handlerInput, userAnswer) {
  const requestAttributes =
    handlerInput.attributesManager.getRequestAttributes();
  const sessionAttributes =
    handlerInput.attributesManager.getSessionAttributes();
  const correctAnswer = parseInt(sessionAttributes.currentExercise.answer, 10);
  let currentScore = parseInt(sessionAttributes.currentScore, 10);

  let speechOutput, repromptText;

  if (Number.isInteger(parseInt(userAnswer, 10))) {
    if (correctAnswer === parseInt(userAnswer, 10)) {
      currentScore += 1;
      speechOutput = requestAttributes.t("ANSWER_CORRECT_MESSAGE");
    } else {
      speechOutput = requestAttributes.t(
        "ANSWER_WRONG_MESSAGE",
        userAnswer,
        correctAnswer
      );
    }

    const exercise = createExercise(handlerInput);

    repromptText = formulateQuestion(handlerInput, exercise);

    updateExerciseInSession(handlerInput, exercise, currentScore);
  } else {
    speechOutput = requestAttributes.t("NOT_UNDERSTAND_MESSAGE");
    repromptText = requestAttributes.t("PLEASE_REPEAT_MESSAGE");
  }

  speechOutput += repromptText;

  return handlerInput.responseBuilder
    .speak(speechOutput)
    .reprompt(repromptText)
    .getResponse();
};

const handleDontKnow = function (handlerInput) {
  const requestAttributes =
    handlerInput.attributesManager.getRequestAttributes();

  let speechOutput;

  speechOutput = requestAttributes.t("DONT_KNOW_MESSAGE");

  const exercise = createExercise(handlerInput);

  const repromptText = formulateQuestion(handlerInput, exercise);

  updateExerciseInSession(handlerInput, exercise);

  speechOutput += repromptText;

  return handlerInput.responseBuilder
    .speak(speechOutput)
    .reprompt(repromptText)
    .getResponse();
};

const handleScore = function (handlerInput) {
  const requestAttributes =
    handlerInput.attributesManager.getRequestAttributes();
  const sessionAttributes =
    handlerInput.attributesManager.getSessionAttributes();

  const exercise = sessionAttributes.currentExercise;

  let speechOutput, repromptText;

  speechOutput = requestAttributes.t(
    "SCORE_MESSAGE",
    sessionAttributes.currentScore,
    sessionAttributes.exercisesCount
  );

  repromptText = formulateQuestion(handlerInput, exercise);

  speechOutput += repromptText;

  return handlerInput.responseBuilder
    .speak(speechOutput)
    .reprompt(repromptText)
    .getResponse();
};

const handleDifficultyLevel = function (
  handlerInput,
  difficultyLevelSlotValue,
  upperLimitSlotValue
) {
  const requestAttributes =
    handlerInput.attributesManager.getRequestAttributes();

  let operators, upperLimit;
  switch (difficultyLevelSlotValue) {
    case requestAttributes.t("DIFFICULTY_LEVEL_VERY_EASY"):
      operators = DIFFICULTY_LEVEL.VERY_EASY.operators;
      upperLimit = DIFFICULTY_LEVEL.VERY_EASY.upperLimit;
      break;
    case requestAttributes.t("DIFFICULTY_LEVEL_EASY"):
      operators = DIFFICULTY_LEVEL.EASY.operators;
      upperLimit = DIFFICULTY_LEVEL.EASY.upperLimit;
      break;
    case requestAttributes.t("DIFFICULTY_LEVEL_MEDIUM"):
      operators = DIFFICULTY_LEVEL.MEDIUM.operators;
      upperLimit = DIFFICULTY_LEVEL.MEDIUM.upperLimit;
      break;
    case requestAttributes.t("DIFFICULTY_LEVEL_DIFFICULT"):
      operators = DIFFICULTY_LEVEL.DIFFICULT.operators;
      upperLimit = DIFFICULTY_LEVEL.DIFFICULT.upperLimit;
      break;
    case requestAttributes.t("DIFFICULTY_LEVEL_VERY_DIFFICULT"):
      operators = DIFFICULTY_LEVEL.VERY_DIFFICULT.operators;
      upperLimit = DIFFICULTY_LEVEL.VERY_DIFFICULT.upperLimit;
      break;
  }

  if (Number.isInteger(upperLimitSlotValue)) {
    upperLimit = upperLimitSlotValue;
  }

  let speechOutput, repromptText;

  speechOutput = `Slot: ${operators}, ${upperLimit} `;

  repromptText = "Danke";

  speechOutput += repromptText;

  setDifficultyLevelInSession(handlerInput, operators, upperLimit);

  return handlerInput.responseBuilder
    .speak(speechOutput)
    .reprompt(repromptText)
    .getResponse();
};

function createExercise(handlerInput) {
  const sessionAttributes =
    handlerInput.attributesManager.getSessionAttributes();

  const upperLimit = sessionAttributes.upperLimit;
  const operators = sessionAttributes.possibleOperators;

  const left = Math.floor(Math.random() * (upperLimit + 1));
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let right, answer;
  switch (operator) {
    case "ADDITION":
      right = Math.floor(Math.random() * (upperLimit + 1 - left));
      answer = left + right;
      break;
    case "SUBTRACTION":
      right = Math.floor(Math.random() * (left + 1));
      answer = left - right;
      break;
    case "MULTIPLICATION":
      // TODO
      right = Math.floor(Math.random() * (left + 1));
      answer = left - right;
      break;
    case "DIVISION":
      // TODO
      right = Math.floor(Math.random() * (left + 1));
      answer = left - right;
      break;
  }

  return { left, operator, right, answer };
}

function formulateQuestion(handlerInput, exercise) {
  const requestAttributes =
    handlerInput.attributesManager.getRequestAttributes();

  const operator = requestAttributes.t(`OPERATOR_${exercise.operator}`);
  const question = requestAttributes.t(
    "QUESTION_MESSAGE",
    exercise.left.toString(),
    operator,
    exercise.right.toString()
  );

  return question;
}

function initExerciseInSession(handlerInput, exercise) {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();

  Object.assign(sessionAttributes, {
    currentExercise: exercise,
    exercisesCount: 0,
    currentScore: 0,
  });

  attributesManager.setSessionAttributes(sessionAttributes);
}

function updateExerciseInSession(handlerInput, exercise, score) {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();

  const count = sessionAttributes.exercisesCount + 1;

  Object.assign(sessionAttributes, {
    currentExercise: exercise,
    exercisesCount: count,
  });

  if (Number.isInteger(score)) {
    Object.assign(sessionAttributes, {
      currentScore: score,
    });
  }

  attributesManager.setSessionAttributes(sessionAttributes);
}

function setDifficultyLevelInSession(handlerInput, operators, upperLimit) {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();

  Object.assign(sessionAttributes, {
    possibleOperators: operators,
    upperLimit: upperLimit,
  });

  attributesManager.setSessionAttributes(sessionAttributes);
}

module.exports = {
  start,
  handleAnswer,
  handleDontKnow,
  handleScore,
  handleDifficultyLevel,
};
