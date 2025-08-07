# Create a skeleton _app-container_ library

Following the convention of keeping the main app component as clean as possible create an app-container library that will contain a Shell component that renders the application's navbar and hosts the primary application Router Outlet.

Do this by simply creating a new folder `libs` under the `src` folder. This will be the root folder for all application libraries. Start by creating the following folder structure for this library.

```bat
libs
|
|-- app-container
|   |
|   |-- lib
|   |   |
|   |   |-- shell
|   |       |
|   |       |-- shell.ts
|   |
|   |-- index.ts
```

As the library is developed source files will be added to the lib folder and all public elements will be exposed through the `index.ts` file. At this stage that will only be the Shell component

```ts
export { Shell } from './lib/shell/shell';
```

Finally, set up path mapping in the `tsconfig.json` file.

```ts
{
  "compileOnSave": false,
  "compilerOptions": {
    "strict": true,
    ..
    ..
    "baseUrl": "./src",
    "paths": {
      "@app-container/*": ["libs/app-container/*"]
    }
  },
  "angularCompilerOptions": {
    ..
    ..
  },
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    }
  ]
}
```

Add values for the "compilerOptions" properties "baseUrl" and "paths". This means that importing the Shell component is simply:

```ts
import { Shell } from '@app-container/index';
```

Doesn't seem worth it here but as libraries grow in size and expose larger public APIs this approach will make the code cleaner and more readable.
