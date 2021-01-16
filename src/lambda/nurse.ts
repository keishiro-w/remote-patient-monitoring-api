"use strict";
import AWS from "aws-sdk";
import { APIGatewayProxyHandler } from 'aws-lambda'
var dynamodb = require('serverless-dynamodb-client');
var docClient = dynamodb.doc;

AWS.config.update({
  region: process.env.region
});
import NurseTable from "../aws/nurseTable";
import Validator from "../util/validator";

export namespace Nurse {

  export const getNurses: APIGatewayProxyHandler = async () => {
    const nurseTable = new NurseTable(docClient);
    const validator = new Validator();
    try {
      const res = await nurseTable.getNurses();
      if (validator.checkDyanmoQueryResultEmpty(res)) {
        const errorModel = {
          errorCode: "RPM00001",
          errorMessage: "Not Found",
        };
        return {
          statusCode: 404,
          body: JSON.stringify({
            errorModel,
          }),
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(res),
      };
    } catch (err) {
      console.log("getNurseTable-index error");
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: err
        }),
      };
    }
  }

  export const postNurse: APIGatewayProxyHandler = async (event) => {
    console.log('called postNurse');
    const nurseTable = new NurseTable(docClient);
    const validator = new Validator();
    const bodyData = validator.jsonBody(event.body);
    try {
      if (!validator.checkNurseBody(bodyData)) {
        const errorModel = {
          errorCode: "RPM00002",
          errorMessage: "Invalid Body",
        };
        return {
          statusCode: 400,
          body: JSON.stringify({
            errorModel,
          }),
        };
      }
      const res = await nurseTable.postNurse(bodyData);
      return {
        statusCode: 200,
        body: JSON.stringify(res),
      };
    } catch (err) {
      console.log("postNurseTable-index error");
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: err
        }),
      };
    }
  }

  export const getNurse: APIGatewayProxyHandler = async (event) => {
    const nurseTable = new NurseTable(docClient);
    const validator = new Validator();
    if (!event.pathParameters || !event.pathParameters.nurseId) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          errorCode: "RPM00001",
          errorMessage: 'Not Found'
        })
      }
    }
    console.log('call getNurse with ' + event.pathParameters.nurseId);
    try {
      const res = await nurseTable.getNurse(event.pathParameters.nurseId);
      console.log(res);
      if (validator.checkDynamoGetResultEmpty(res)) {
        const errorModel = {
          errorCode: "RPM00001",
          errorMessage: "Not Found",
        };
        return {
          statusCode: 404,
          body: JSON.stringify({
            errorModel,
          }),
        };
      }
      console.log(res);
      console.log(JSON.stringify(res));
      return {
        statusCode: 200,
        body: JSON.stringify(res),
      };
    } catch (err) {
      console.log("getNurseTable-index error");
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: err
        }),
      };
    }
  }

  export const putNurse: APIGatewayProxyHandler = async (event) => {
    const nurseTable = new NurseTable(docClient);
    const validator = new Validator();
    const bodyData = validator.jsonBody(event.body);
    try {
      if (!validator.checkNurseBody(bodyData)) {
        const errorModel = {
          errorCode: "RPM00002",
          errorMessage: "Invalid Body",
        };
        return {
          statusCode: 400,
          body: JSON.stringify({
            errorModel,
          }),
        };
      }
      if (!event.pathParameters || !event.pathParameters.nurseId) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            errorCode: "RPM00001",
            errorMessage: 'Not Found'
          })
        }
      }
      const res = await nurseTable.putNurse(
        event.pathParameters.nurseId,
        bodyData
      );
      return {
        statusCode: 200,
        body: JSON.stringify(res),
      };
    } catch (err) {
      console.log("putNurseTable-index error");
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: err
        }),
      };
    }
  }
}