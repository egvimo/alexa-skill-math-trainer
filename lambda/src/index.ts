import {
  ErrorHandler,
  getSlotValue,
  HandlerInput,
  RequestHandler,
  RequestInterceptor,
  SkillBuilders,
} from "ask-sdk-core";
import { Response, SessionEndedRequest } from "ask-sdk-model";
import { Resource, use, t } from "i18next";
import * as sprintf from "i18next-sprintf-postprocessor";
import { Game } from "./game";
import { de } from "./i18n/de";

const languageStrings: Resource = {
  de: de,
};

const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "LaunchRequest";
  },
  handle(handlerInput: HandlerInput): Response {
    const game = new Game(handlerInput);

    return game.start();
  },
};

const AnswerIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" && request.intent.name === "AnswerIntent"
    );
  },
  handle(handlerInput: HandlerInput): Response {
    const answer = getSlotValue(handlerInput.requestEnvelope, "answer");
    const game = new Game(handlerInput);

    return game.handleAnswer(answer);
  },
};

const DontKnowIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "DontKnowIntent"
    );
  },
  handle(handlerInput: HandlerInput): Response {
    const game = new Game(handlerInput);

    return game.handleDontKnow();
  },
};

const DifficultyLevelIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "DifficultyLevelIntent"
    );
  },
  handle(handlerInput: HandlerInput): Response {
    const difficultyLevel = getSlotValue(
      handlerInput.requestEnvelope,
      "difficultyLevel"
    );
    const upperLimit = getSlotValue(handlerInput.requestEnvelope, "upperLimit");
    const game = new Game(handlerInput);

    return game.handleDifficultyLevel(difficultyLevel, upperLimit);
  },
};

const ScoreIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" && request.intent.name === "ScoreIntent"
    );
  },
  handle(handlerInput: HandlerInput): Response {
    const game = new Game(handlerInput);

    return game.handleScore();
  },
};

const HelpIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput: HandlerInput): Response {
    const speechText = "TODO!"; // TODO

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      (request.intent.name === "AMAZON.CancelIntent" ||
        request.intent.name === "AMAZON.StopIntent")
    );
  },
  handle(handlerInput: HandlerInput): Response {
    const requestAttributes =
      handlerInput.attributesManager.getRequestAttributes();
    const speakOutput = requestAttributes.t("GOODBYE");

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const SessionEndedRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "SessionEndedRequest";
  },
  handle(handlerInput: HandlerInput): Response {
    console.log(
      `Session ended with reason: ${
        (handlerInput.requestEnvelope.request as SessionEndedRequest).reason
      }`
    );

    // Any cleanup logic goes here.

    return handlerInput.responseBuilder.getResponse();
  },
};

const LocalizationInterceptor: RequestInterceptor = {
  process(handlerInput: HandlerInput) {
    const localizationClient = use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: "de",
      resources: languageStrings,
    });

    // @ts-ignore
    localizationClient.localize = function (...args: string[]) {
      let values = [];

      for (var i = 1; i < args.length; i++) {
        values.push(args[i]);
      }
      const value = t(args[0], {
        returnObjects: true,
        postProcess: "sprintf",
        sprintf: values,
      });

      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      } else {
        return value;
      }
    };

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args: any[]) {
      // @ts-ignore
      return localizationClient.localize(...args);
    };
  },
};

const UnexpectedErrorHandler: ErrorHandler = {
  canHandle(handlerInput: HandlerInput, error: Error): boolean {
    return true;
  },
  handle(handlerInput: HandlerInput, error: Error): Response {
    console.log(`Error handled: ${error.message}`);

    // TODO
    return handlerInput.responseBuilder
      .speak("Sorry, I don't understand your command. Please say it again.")
      .reprompt("Sorry, I don't understand your command. Please say it again.")
      .getResponse();
  },
};

export const handler = SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    AnswerIntentHandler,
    DontKnowIntentHandler,
    DifficultyLevelIntentHandler,
    ScoreIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(UnexpectedErrorHandler)
  .lambda();
