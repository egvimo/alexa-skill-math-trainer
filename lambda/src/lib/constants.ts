import { Difficulty, DifficultyLevel, Operator } from "./model";

interface IDifficultyLevels {
  [DifficultyLevel.VeryEasy]: Difficulty;
  [DifficultyLevel.Easy]: Difficulty;
  [DifficultyLevel.Medium]: Difficulty;
  [DifficultyLevel.Difficult]: Difficulty;
  [DifficultyLevel.VeryDifficult]: Difficulty;
}

export const DifficultyLevels: IDifficultyLevels = {
  [DifficultyLevel.VeryEasy]: {
    level: DifficultyLevel.VeryEasy,
    upperLimit: 10,
    operators: [Operator.Addition],
  },
  [DifficultyLevel.Easy]: {
    level: DifficultyLevel.Easy,
    upperLimit: 20,
    operators: [Operator.Addition, Operator.Subtraction],
  },
  [DifficultyLevel.Medium]: {
    level: DifficultyLevel.Medium,
    upperLimit: 100,
    operators: [
      Operator.Addition,
      Operator.Subtraction,
      Operator.Multiplication,
    ],
  },
  [DifficultyLevel.Difficult]: {
    level: DifficultyLevel.Difficult,
    upperLimit: 100,
    operators: [
      Operator.Addition,
      Operator.Subtraction,
      Operator.Multiplication,
      Operator.Division,
    ],
  },
  [DifficultyLevel.VeryDifficult]: {
    level: DifficultyLevel.VeryDifficult,
    upperLimit: 1000,
    operators: [
      Operator.Addition,
      Operator.Subtraction,
      Operator.Multiplication,
      Operator.Division,
    ],
  },
};
