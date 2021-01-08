"use strict";
var AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.region
});
var docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10"
});
var NurseTable = require("../aws/nurseTable");
var Validator = require("../util/validator");
var Formatter = require("../util/formatter");

exports.getNurses = async (event, context, callback) => {
  const nurseTable = new NurseTable(docClient);
  const validator = new Validator();
  const formatter = new Formatter();
  try {
    const res = await nurseTable.getNurses();
    if (validator.checkDyanmoQueryResultEmpty(res)) {
      const errorModel = {
        errorCode: "RPM00001",
        errorMessage: "Not Found",
      };
      callback(null, {
        statusCode: 404,
        body: JSON.stringify({
          errorModel,
        }),
      });
    }
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(res),
    });
  } catch (err) {
    console.log("getNurseTable-index error");
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: err
      }),
    });
  }
};

exports.postNurse = async (event, context, callback) => {
  console.log('called postNurse');
  const nurseTable = new NurseTable(docClient);
  const validator = new Validator();
  try {
    if (!validator.checkNurseBody(JSON.parse(event.body))) {
      const errorModel = {
        errorCode: "RPM00002",
        errorMessage: "Invalid Body",
      };
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          errorModel,
        }),
      });
    }
    const res = await nurseTable.postNurse(JSON.parse(event.body));
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(res),
    });
  } catch (err) {
    console.log("postNurseTable-index error");
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: err
      }),
    });
  }
};

exports.getNurse = async (event, context, callback) => {
  const nurseTable = new NurseTable(docClient);
  const validator = new Validator();
  const formatter = new Formatter();
  console.log('call getNurse with ' + event.pathParameters.nurseId);
  try {
    const res = await nurseTable.getNurse(event.pathParameters.nurseId);
    console.log(res);
    if (validator.checkDynamoGetResultEmpty(res)) {
      const errorModel = {
        errorCode: "RPM00001",
        errorMessage: "Not Found",
      };
      callback(null, {
        statusCode: 404,
        body: JSON.stringify({
          errorModel,
        }),
      });
    }
    console.log(res);
    console.log(JSON.stringify(res));
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(res),
    });
  } catch (err) {
    console.log("getNurseTable-index error");
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: err
      }),
    });
  }
};

exports.putNurse = async (event, context, callback) => {
  const nurseTable = new NurseTable(docClient);
  const validator = new Validator();
  try {
    if (!validator.checkNurseBody(JSON.parse(event.body))) {
      const errorModel = {
        errorCode: "RPM00002",
        errorMessage: "Invalid Body",
      };
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          errorModel,
        }),
      });
    }
    const res = await nurseTable.putNurse(
      event.pathParameters.nurseId,
      JSON.parse(event.body)
    );
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(res),
    });
  } catch (err) {
    console.log("putNurseTable-index error");
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: err
      }),
    });
  }
};