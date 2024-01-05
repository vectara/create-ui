import axios from "axios";
import { START_TAG, END_TAG } from "../utils/parseSnippet";
import { mmrRerankerId } from "../view/types";

type Config = {
  filter: string;
  queryValue?: string;
  rerank?: boolean;
  rerankNumResults?: number;
  rerankerId?: number;
  rerankDiversityBias?: number;
  hybridNumWords: number;
  hybridLambdaShort?: number;
  hybridLambdaLong?: number;
  customerId: string;
  corpusId: string;
  endpoint: string;
  apiKey: string;
};

export const sendSearchRequest = async ({
  filter,
  queryValue,
  rerank,
  rerankNumResults,
  rerankerId,
  rerankDiversityBias,
  hybridNumWords,
  hybridLambdaShort,
  hybridLambdaLong,
  customerId,
  corpusId,
  endpoint,
  apiKey
}: Config) => {
  const lambda =
    typeof queryValue === "undefined" || queryValue.trim().split(" ").length > hybridNumWords
      ? hybridLambdaLong
      : hybridLambdaShort;
  const corpusKeyList = corpusId.split(",").map((id) => {
    return {
      customerId,
      corpusId: id,
      lexicalInterpolationConfig: {
        lambda: lambda
      },
      metadataFilter: filter ? `doc.source = '${filter}'` : undefined
    };
  });

  const body = {
    query: [
      {
        query: queryValue,
        start: 0,
        numResults: rerank ? rerankNumResults : 10,
        corpusKey: corpusKeyList,
        contextConfig: {
          sentencesBefore: 2,
          sentencesAfter: 2,
          startTag: START_TAG,
          endTag: END_TAG
        },
        ...(rerank
          ? {
              rerankingConfig: {
                rerankerId: rerankerId,
                ...(rerankerId === mmrRerankerId
                  ? {
                      mmrConfig: {
                        diversityBias: rerankDiversityBias
                      }
                    }
                  : {})
              }
            }
          : {})
      }
    ]
  };

  let headers = {};
  let url = "";
  if (process.env.NODE_ENV === "production") {
    // Call proxy server if in production
    url = `/v1/query`;
    headers = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    };
  } else {
    // Call directly if in development
    url = `https://${endpoint}/v1/query`;
    headers = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "customer-id": customerId,
        "x-api-key": apiKey,
        "grpc-timeout": "60S"
      }
    };
  }
  const result = await axios.post(url, body, headers);

  const status = result["data"]["responseSet"][0]["status"];
  if (status.length > 0 && status[0]["code"] === "UNAUTHORIZED") {
    console.log("UNAUTHORIZED access; check your API key and customer ID");
  }

  return result["data"]["responseSet"][0];
};
