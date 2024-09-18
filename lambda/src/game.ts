import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { Exercise, Operation, Operator } from "./lib/model";
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

    this.session.init();

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

  handleArithmeticOperation(arithmeticOperationSlotValue: string): Response {
    let operation: Operation | undefined = undefined;
    switch (arithmeticOperationSlotValue) {
      case this.requestAttributes.t(Operation.Addition):
        operation = Operation.Addition;
        break;
      case this.requestAttributes.t(Operation.Subtraction):
        operation = Operation.Subtraction;
        break;
      case this.requestAttributes.t(Operation.Multiplication):
        operation = Operation.Multiplication;
        break;
      case this.requestAttributes.t(Operation.Division):
        operation = Operation.Division;
        break;
    }

    this.session.setOperation(operation!);

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
    const operation = this.session.getOperation();

    const exercise: Exercise = {} as Exercise;
    const upperLimit = 100;

    switch (operation) {
      case Operation.Addition:
        exercise.operator = Operator.Addition;
        exercise.leftOperand = Math.floor(Math.random() * (upperLimit + 1));
        exercise.rightOperand = Math.floor(
          Math.random() * (upperLimit + 1 - exercise.leftOperand)
        );
        exercise.result = exercise.leftOperand + exercise.rightOperand;
        break;
      case Operation.Subtraction:
        exercise.operator = Operator.Subtraction;
        exercise.leftOperand = Math.floor(Math.random() * (upperLimit + 1));
        exercise.rightOperand = Math.floor(
          Math.random() * (exercise.leftOperand + 1)
        );
        exercise.result = exercise.leftOperand - exercise.rightOperand;
        break;
      case Operation.Multiplication:
        exercise.operator = Operator.Multiplication;
        exercise.leftOperand = Math.floor(
          Math.random() * (upperLimit / 10 + 1)
        );
        exercise.rightOperand = Math.floor(
          Math.random() * (upperLimit / 10 + 1)
        );
        exercise.result = exercise.leftOperand * exercise.rightOperand;
        break;
      case Operation.Division:
        exercise.operator = Operator.Division;
        exercise.result = Math.floor(Math.random() * (upperLimit / 10 + 1));
        exercise.rightOperand = Math.floor(
          Math.random() * (upperLimit / 10 + 1)
        );
        exercise.leftOperand = exercise.result * exercise.rightOperand;
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
