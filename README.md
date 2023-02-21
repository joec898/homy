## HOMY -- React.js and Node.js practice project

Boostrapped from https://www.youtube.com/watch?v=MpQbwtSiZ7E
                 https://github.com/dejwid/airbnb-clone

### node.js version
node.js >= 16.10

### client -- front end in react.js
yarn create vite client
cd client
yarn (will install yarn v1.22.15)

# use tailwindcss for VITE
yarn add tailwindcss postcss autoprefixer (https://tailwindcss.com/docs/guides/vite )
npx tailwindcss init -p (created tailwind.config.cjs)

update tailwind.config.cjs with:
content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

replace content of index.css with:
@tailwind base;
@tailwind components;
@tailwind utilities;

https://vitejs.dev/guide/

yarn add date-fns
yarn add dotenv
yarn add react-router-dom
yarn add path-browserify (this resolve issue: Module "path" has been externalized for browser compatibility. Cannot access "path.dirname" in client code.)

# start client app
yarn dev

### api -- backend in node.js

add a folder: api
in the api folder:
yarn add express
yarn add cors
yarn add mongoose
yarn add dotenv
yarn add bcryptjs
yarn add jsonwebtoken
yarn add cookie-parser
yarn add image-downloader (https://yarnpkg.com/package/image-downloader)
yarn add multer

# start api
nodemon index.js


