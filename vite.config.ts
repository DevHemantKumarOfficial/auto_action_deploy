import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {
      // URL: "https://uat-api.inphamed.com/inphamed/api/v1/", //UAT 
      // URL: "https://api.inphamed.com/inphamed/api/v1/", //PROD
      URL: "http://localhost:3000/inphamed/api/v1/",
      isLocal: false
    },
  },
  server: {
    host: true,
    port: 5174,
  },
});
