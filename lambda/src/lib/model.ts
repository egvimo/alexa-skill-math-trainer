export enum Operation {
  Addition = "ADDITION",
  Subtraction = "SUBTRACTION",
  Multiplication = "MULTIPLICATION",
  Division = "DIVISION",
}

export enum Operator {
  Addition = "ADDITION",
  Subtraction = "SUBTRACTION",
  Multiplication = "MULTIPLICATION",
  Division = "DIVISION",
}

export type Exercise = {
  leftOperand: number;
  operator: Operator;
  rightOperand: number;
  result: number;
};
