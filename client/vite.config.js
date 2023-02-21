import { loadEnv, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//https://vitejs.dev/config/
export default defineConfig({
 plugins: [react()],
 resolve: {
   alias: {
     path: "path-browserify",
     process: "process/browser",
   },
 },
})

// export default ({ mode }) => {
//   process.env = {...process.env, ...loadEnv(mode, process.cwd())};
//   return defineConfig({
//       plugins: [react()],
//       resolve: {
//          alias: {
//             path: "path-browserify",
//             process: "process/browser",
//          },
//        }
//   });
// };
