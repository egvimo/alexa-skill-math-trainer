import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { DifficultyLevels } from "./lib/constants";
import { Difficulty, DifficultyLevel, Exercise, Operator } from "./lib/model";
import { Session } from "./lib/session";

export class Game {
  private requestAttributes;
  private session;

  constructor(private handlerInput: HandlerInput) {
    this.requestAttributes =
      handlerInput.attributesManager.getRequestAttributes();
    this.session = new Session(handlerInput);
  }

  start(): Response {
    const speechOutput = this.requestAttributes.t(
      "WELCOME_MESSAGE",
      this.requestAttributes.t("GAME_NAME")
    );
    const reprompt = this.requestAttributes.t("NEW_GAME_MESSAGE");

    this.session.init()

    return this.createResponse(speechOutput, reprompt);
  }

  handleAnswer(answerSlotValue: string): Response {
    const correctAnswer = this.session.getExercise().result;
    let currentScore = this.session.getCurrentScore();

    let speechOutput, reprompt;

    if (Number.isInteger(parseInt(answerSlotValue, 10))) {
      if (correctAnswer === parseInt(answerSlotValue, 10)) {
        currentScore += 1;
        speechOutput = this.requestAttributes.t("ANSWER_CORRECT_MESSAGE");
      } else {
        speechOutput = this.requestAttributes.t(
          "ANSWER_WRONG_MESSAGE",
          answerSlotValue,
          correctAnswer
        );
      }

      const exercise = this.createExercise();
      this.session.setExercise(exercise, currentScore);

      reprompt = this.formulateQuestion(exercise);
    } else {
      speechOutput = this.requestAttributes.t("NOT_UNDERSTAND_MESSAGE");
      reprompt = this.requestAttributes.t("PLEASE_REPEAT_MESSAGE");
    }

    return this.createResponse(speechOutput, reprompt);
  }

  handleDontKnow(): Response {
    const exercise = this.createExercise();
    this.session.setExercise(exercise);
    return this.createResponse(
      this.requestAttributes.t("DONT_KNOW_MESSAGE"),
      this.formulateQuestion(exercise)
    );
  }

  handleDifficultyLevel(
    difficultyLevelSlotValue: string,
    upperLimitSlotValue?: string
  ): Response {
    let difficulty: Difficulty | undefined = undefined;
    switch (difficultyLevelSlotValue) {
      case this.requestAttributes.t(DifficultyLevel.VeryEasy):
        difficulty = DifficultyLevels.VERY_EASY;
        break;
      case this.requestAttributes.t(DifficultyLevel.Easy):
        difficulty = DifficultyLevels.EASY;
        break;
      case this.requestAttributes.t(DifficultyLevel.Medium):
        difficulty = DifficultyLevels.MEDIUM;
        break;
      case this.requestAttributes.t(DifficultyLevel.Difficult):
        difficulty = DifficultyLevels.DIFFICULT;
        break;
      case this.requestAttributes.t(DifficultyLevel.VeryDifficult):
        difficulty = DifficultyLevels.VERY_DIFFICULT;
        break;
    }

    if (difficulty && Number.isInteger(upperLimitSlotValue)) {
      difficulty.upperLimit = parseInt(upperLimitSlotValue!, 10);
    }

    this.session.setDifficulty(difficulty!);

    const exercise = this.createExercise();
    this.session.setExercise(exercise);

    return this.createResponse(
      this.requestAttributes.t("START_MESSAGE"),
      this.formulateQuestion(exercise)
    );
  }

  handleScore(): Response {
    const exercise = this.session.getExercise();
    const speechOutput = this.requestAttributes.t(
      "SCORE_MESSAGE",
      this.session.getCurrentScore(),
      this.session.getExerciseCount()
    );
    const reprompt = this.formulateQuestion(exercise);
    return this.createResponse(speechOutput, reprompt);
  }

  private createExercise(): Exercise {
    const difficulty = this.session.getDifficulty();

    const exercise: Exercise = {} as Exercise;

    exercise.operator =
      difficulty.operators[
        Math.floor(Math.random() * difficulty.operators.length)
      ];

    switch (exercise.operator) {
      case Operator.Addition:
        exercise.leftOperand = Math.floor(
          Math.random() * (difficulty.upperLimit + 1)
        );
        exercise.rightOperand = Math.floor(
          Math.random() * (difficulty.upperLimit + 1 - exercise.leftOperand)
        );
        exercise.result = exercise.leftOperand + exercise.rightOperand;
        break;
      case Operator.Subtraction:
        exercise.leftOperand = Math.floor(
          Math.random() * (difficulty.upperLimit + 1)
        );
        exercise.rightOperand = Math.floor(
          Math.random() * (exercise.leftOperand + 1)
        );
        exercise.result = exercise.leftOperand - exercise.rightOperand;
        break;
      case Operator.Multiplication:
        if (difficulty.level === DifficultyLevel.Medium) {
          exercise.leftOperand = Math.floor(
            Math.random() * (difficulty.upperLimit / 10 + 1)
          );
          exercise.rightOperand = Math.floor(
            Math.random() * (difficulty.upperLimit / 10 + 1)
          );
        } else {
          exercise.leftOperand = Math.floor(
            Math.random() * (difficulty.upperLimit / 2 + 1)
          );
          exercise.rightOperand = Math.floor(
            Math.random() *
              (Math.floor(difficulty.upperLimit / exercise.leftOperand) + 1)
          );
        }
        exercise.result = exercise.leftOperand * exercise.rightOperand;
        break;
      case Operator.Division:
        if (difficulty.level === DifficultyLevel.Difficult) {
          exercise.result = Math.floor(
            Math.random() * (difficulty.upperLimit / 10 + 1)
          );
          exercise.rightOperand = Math.floor(
            Math.random() * (difficulty.upperLimit / 10 + 1)
          );
        } else {
          exercise.result = Math.floor(
            Math.random() * (difficulty.upperLimit / 2 + 1)
          );
          exercise.rightOperand = Math.floor(
            Math.random() *
              (Math.floor(difficulty.upperLimit / exercise.leftOperand) + 1)
          );
        }
        exercise.leftOperand = exercise.leftOperand * exercise.rightOperand;
        break;
    }

    return exercise;
  }

  private formulateQuestion(exercise: Exercise): string {
    return this.requestAttributes.t(
      "QUESTION_MESSAGE",
      exercise.leftOperand.toString(),
      this.requestAttributes.t(exercise.operator),
      exercise.rightOperand.toString()
    );
  }

  private createResponse(speechOutput: string, reprompt: string): Response {
    return this.handlerInput.responseBuilder
      .speak(speechOutput + reprompt)
      .reprompt(reprompt)
      .getResponse();
  }
}
