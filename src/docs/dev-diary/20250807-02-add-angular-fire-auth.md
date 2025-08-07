# Add Angular Fire and Implement Authentication

## Add Angular Fire

The documentation for Angular Fire says to add this to your workspace simply:

```bat
> ng add @angular/fire
```

Unfortunately this didn't work due to conflicting peer dependencies - yay!

Worked around the problem by installing using npm.

```bat
> npm install @angular/fire firebase --force
```

The _--force_ flag ignores peer dependency conflicts and installs anyway. I've done this before and it seems to be ok but the proof will be in using the APIs and see what happens.

## Configure Angular Fire

First need to create a new Firebase project. Apparently it is possible to have multiple databases in a single project and also host multiple apps, but as I haven't done this before I just went forward with creating a new project.

Used the config data from this project to setup the Firebase and authentication providers in the `app.config.ts` file.

## Add Authentication library

Add a new library under the `libs/data-access` folder called `authentication`. Add the code to support login and logout and provide a signal API (_loggedIn: Signal\<boolean\>_) indicating whether or not a user is currently logged in.

To provde this works OK edit the temp Shell component implementation to use the second icon button to toggle the login state - show the current state by a Login icon when logged out and a Logout icon when logged in. Also only show the Favorite icon when logged in.
