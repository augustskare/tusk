declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ID: string;
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      VAPID_KEY: string;
      SERVICE: string;
      REDIRECT_URI: string;
      SCOPE: string;
    }
  }
}

export {};
