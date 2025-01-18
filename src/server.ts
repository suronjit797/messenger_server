import mongoose from "mongoose";
import http, { Server } from "http";
import { errorLogger, successLogger } from "./shared/logger";
import config from "./config";
import app from "./app";
import { expressMiddleware } from "@apollo/server/express4";
import globalError, { notFoundError } from "./app/middleware/globalError";
import { graphqlServer } from "./app/graphql";
import { decodeToken } from "./app/middleware/auth";
import { GraphqlContext } from "./shared/globalInterfaces";
import initSocket from "./Scoket";

// Define server variable type
export const server: Server = http.createServer(app);

process.on("uncaughtException", (error: Error) => {
  errorLogger(`uncaughtException: ${error.message}`);
  process.exit(1);
});

const bootFunctions = async (): Promise<void> => {
  try {
    if (!config.PORT || !config.DB_URI) {
      errorLogger("Port or DB_URI not found in config");
      return process.exit(1);
    }

    successLogger(`Connecting to database at ${config.DB_URI}`);
    await mongoose.connect(config.DB_URI as string);
    successLogger("🛢 Database connected...");

    // init socket
    initSocket();

    // Initialize GraphQL server
    await graphqlServer.start();
    app.use(
      "/api/v1/graphql",
      expressMiddleware<GraphqlContext>(graphqlServer, {
        context: async ({ req, res }): Promise<GraphqlContext> => {
          const bearerToken = req.headers?.authorization; // Extract token from "Bearer <token>"

          let user;
          if (bearerToken) {
            try {
              user = await decodeToken(bearerToken); // Decode the token to get user details
            } catch (error) {
              console.error("Invalid token", error);
              user = undefined; // Handle invalid tokens gracefully
            }
          }

          return {
            user,
            req,
            res,
          };
        },
      })
    );

    // Middleware for global errors and 404 handling
    app.use(globalError);
    app.use(notFoundError);

    server.listen(config.PORT, () => {
      successLogger(
        `[${config.NODE_ENV === "production" ? "Prod" : "Dev"}] Server is online at http://localhost:${config.PORT}/`
      );
    });
  } catch (error: any) {
    errorLogger(`Database connection failed: ${error.message}`);
    process.exit(1);
  }

  process.on("unhandledRejection", (error: Error) => {
    if (server) {
      server.close(() => {
        errorLogger(`Unhandled rejection: ${error.message}`);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

bootFunctions();
