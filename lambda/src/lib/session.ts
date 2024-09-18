import { HandlerInput } from "ask-sdk-core";
import { Exercise, Operation } from "./model";

export class Session {
  private attributesManager;
  private sessionAttributes;

  constructor(handlerInput: HandlerInput) {
    this.attributesManager = handlerInput.attributesManager;
    this.sessionAttributes = this.attributesManager.getSessionAttributes();
  }

  init() {
    Object.assign(this.sessionAttributes, {
      exercisesCount: 0,
      currentScore: 0,
    });

    this.attributesManager.setSessionAttributes(this.sessionAttributes);
  }

  getOperation(): Operation {
    return this.sessionAttributes.operation;
  }

  setOperation(operation: Operation) {
    Object.assign(this.sessionAttributes, {
      operation: operation,
    });

    this.attributesManager.setSessionAttributes(this.sessionAttributes);
  }

  getExercise(): Exercise {
    return this.sessionAttributes.currentExercise;
  }

  setExercise(exercise: Exercise, score: number | undefined = undefined) {
    const count: number = Number.isInteger(
      this.sessionAttributes.exercisesCount
    )
      ? this.sessionAttributes.exercisesCount + 1
      : 0;

    Object.assign(this.sessionAttributes, {
      currentExercise: exercise,
      exercisesCount: count,
    });

    if (Number.isInteger(score)) {
      Object.assign(this.sessionAttributes, {
        currentScore: score,
      });
    }

    this.attributesManager.setSessionAttributes(this.sessionAttributes);
  }

  getExerciseCount(): number {
    return parseInt(this.sessionAttributes.exercisesCount, 10);
  }

  getCurrentScore(): number {
    return parseInt(this.sessionAttributes.currentScore, 10);
  }
}
