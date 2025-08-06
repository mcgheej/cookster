# Configure Prettier and ESLint

Prettier and ESLint are powerful tools that are commonly found in development workflows. ESLint focuses on code quality and potential errors while Prettier is designed to handle code formatting. Used together they significantly help to provide quality code that is easier to maintain. However, to work properly it is important to configure them properly to avoid conflicts.

In researching the correct approach for this project a Google search threw up a few useful articles but the majority of guidance taken here came from a Digital Ocean article titled ["Format Code with Prettier in Visual Studio Code: Setup Guide"](https://www.digitalocean.com/community/tutorials/how-to-format-code-with-prettier-in-visual-studio-code#using-prettier-with-eslint). An article from Angular Architects, called ["NG Best Practices: Prettier & ESLint"](https://www.angulararchitects.io/en/blog/best-practices-prettier-eslint/), also proved useful.

Note that the VSCode environment already had Prettier and ESLint extensions installed.

## Add `.prettierrc` and `.prettierignore`

The `.prettierrc` configuration file is created in the project's root folder and is used to define the required formatting rules. Prettier comes with a workable set of defaults but it is common practice to customise this configuration to give the formatting needed for the project. IN this case I added to following rules to the config file.

```json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 120,
  "bracketSameLine": true
}
```

The `.prettierignore` file tells Prettier which files and folders to skip.

```bat
node_modules/
build/
dist/
coverage/
.vscode/
```

## Use Workspace Settings in `.vscode/settings.json`

Inside the project's `.vscode` folder I created a `settings.json` file and added the following code.

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "prettier.configPath": ".prettierrc"
}
```

These settings ensure that Prettier is enabled in VS Code.

## Install Required Packages

Next install Prettier and the ESLint plugins that integrate with it.

```bat
> npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

- `eslint-config-prettier` turns off formatting rules that would conflict with Prettier
- `eslint-plugin-prettier` runs Prettier as an ESLint rule and reports formatting issues as lint errors

## Configure `.eslintrc.json`

Setup the ESLint configuration to extend Prettier and use the plugin.

```json
{
  "extends": ["eslint:recommended", "plugin:prettier/recommended"]
}
```

This ensure that Prettier formatting issues appear in the Problems tab and are highlighted in VS Code like any other lint error.

## Setup VS Code to Use ESLint and Prettier Together

To format code with Prettier in VS Code while still running ESLint edit the `settings.json` file to leave:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "prettier.configPath": ".prettierrc"
}
```

This setup will:

- Format code with Prettier on save
- Auto-fix lint errors using ESLint
- Avoid duplication or conflicts between the two tools

## Summary

Check out the articles mentioned above for a more detailed description of how the configure the tools, and also some alternative approaches / extra bits not needed on this project.
