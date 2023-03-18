export enum DifficultyLevel {
  VeryEasy = "VERY_EASY",
  Easy = "EASY",
  Medium = "MEDIUM",
  Difficult = "DIFFICULT",
  VeryDifficult = "VERY_DIFFICULT",
}

export enum Operator {
  Addition = "ADDITION",
  Subtraction = "SUBTRACTION",
  Multiplication = "MULTIPLICATION",
  Division = "DIVISION",
}

export type Difficulty = {
  level: DifficultyLevel;
  upperLimit: number;
  operators: Operator[];
};

export type Exercise = {
  leftOperand: number;
  operator: Operator;
  rightOperand: number;
  result: number;
};
