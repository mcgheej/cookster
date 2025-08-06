# Create the Project

The object here is to create a new angular application for the Cookster project. The result of this step will be the vanilla app created using the Angular CLI, shaped as required by using the appropriate Angular CLI options on the new command.

Started by updating the global Angular CLI instance to the latest version of angular.

```bat
> npm install -g @angular/cli
```

Next, in the folder where the new cookster project lives (`C:\Users\mcghe\Documents\angular`) the following Angular CLI command was executed

```bat
> ng new cookster --prefix=ck --skip-tests --style=css --zoneless=false --ssr=false
```

This configures:

- "ck" as the prefix to apply to generated selectors in the initial project
- skip the generation of unit tests (this is a private hobby project not intended to commercial use)
- use CSS stylesheets when creating the initial project
- do not configure the initial application for Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)
- configure the initial application to use `zone.js`

## Git

The Angular CLI default behaviour initialises a Git respository in the new workspace and makes an initial commit for the generated project configuration, which in this case includes the initial application. The Visual Studio Code workspace is already connected to my GitHub account so final step in creating the initial application was to publish the project to GitHub - done.
