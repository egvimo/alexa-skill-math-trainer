import { DifficultyLevel, Operator } from "../lib/model";

export const de = {
  translation: {
    GAME_NAME: "Mathetrainer",
    WELCOME_MESSAGE:
      '<say-as interpret-as="interjection">Willkommen</say-as> bei %s. ',
    NEW_GAME_MESSAGE:
      "Wähle aus fünf Schwierigkeitsstufen zwischen sehr leicht und sehr schwer. ",
    [DifficultyLevel.VeryEasy]: "sehr leicht",
    [DifficultyLevel.Easy]: "leicht",
    [DifficultyLevel.Medium]: "mittel",
    [DifficultyLevel.Difficult]: "schwer",
    [DifficultyLevel.VeryDifficult]: "sehr schwer",
    [Operator.Addition]: "plus",
    [Operator.Subtraction]: "minus",
    [Operator.Multiplication]: "mal",
    [Operator.Division]: "geteilt durch",
    START_MESSAGE: "Legen wir los! ",
    QUESTION_MESSAGE: "Wie viel ist %s %s %s?",
    ANSWER_CORRECT_MESSAGE: [
      '<say-as interpret-as="interjection">Japp</say-as>! ',
      '<say-as interpret-as="interjection">Na klar</say-as>! ',
      '<say-as interpret-as="interjection">Prima</say-as>! ',
      '<say-as interpret-as="interjection">Stimmt</say-as>! ',
      '<say-as interpret-as="interjection">Super</say-as>! ',
      '<say-as interpret-as="interjection">Supi</say-as>! ',
    ],
    ANSWER_WRONG_MESSAGE: [
      '<say-as interpret-as="interjection">Achje</say-as>, <say-as interpret-as="cardinal">%s</say-as> ist leider falsch. Die richtige Antwort ist <say-as interpret-as="cardinal">%s</say-as>. ',
      '<say-as interpret-as="interjection">Ähm</say-as>, mit <say-as interpret-as="cardinal">%s</say-as> liegst du fast richtig. <say-as interpret-as="cardinal">%s</say-as> wär\'s gewesen. ',
      '<say-as interpret-as="interjection">Verflixt</say-as>, <say-as interpret-as="cardinal">%s</say-as> ist nicht richtig. Die korrekte Antwort ist <say-as interpret-as="cardinal">%s</say-as>. ',
    ],
    NOT_UNDERSTAND_MESSAGE: "Das habe ich leider nicht verstanden. ",
    PLEASE_REPEAT_MESSAGE: "Kannst du das bitte noch einmal sagen? ",
    DONT_KNOW_MESSAGE: [
      '<say-as interpret-as="interjection">Alles klar.</say-as> ',
      '<say-as interpret-as="interjection">Null problemo.</say-as> ',
      '<say-as interpret-as="interjection">Okey dokey.</say-as> ',
    ],
    SCORE_MESSAGE: "Du hast %s von %s Aufgaben richtig beantwortet. ",
    GOODBYE: [
      '<say-as interpret-as="interjection">Bis bald.</say-as>',
      '<say-as interpret-as="interjection">Bis dann.</say-as>',
      '<say-as interpret-as="interjection">Mach\'s gut.</say-as>',
      '<say-as interpret-as="interjection">Tschö.</say-as>',
    ],
  },
};
