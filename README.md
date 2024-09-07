# CodeArcheo

This is a Copilot Chat Extension for VSCode that helps with analyzing legacy code.

The main logic is implemented as a Visual Studio Code extension.  Overall, this code is designed to interact with a Copilot language model, process its response, and update the UI accordingly, while handling errors and logging usage. 

The app processes and generates a response when specific commands or user actions are triggered. 



Based on the provided code snippet and context, here are the key triggers:

1. **Command Execution**:

   - The app listens for specific commands to be executed. For example, the command associated with [`CODEARCHEO_AST_COMMAND_ID`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) will trigger the app to process and generate a response.

   - Example:
```typescript
     vscode.commands.registerCommand(CODEARCHEO_AST_COMMAND_ID, async () => {

       // Command logic here

     });
```
2. **Model Selection**:

   - When a user selects a language model using `vscode.lm.selectChatModels`, it triggers the app to prepare and send a request to the model.

   - Example:
```typescript
     const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
```
3. **Button Click**:

   - The app adds a button to the UI stream, and clicking this button triggers a specific command.

   - Example:
```typescript
     stream.button({

       command: CODEARCHEO_AST_COMMAND_ID,

       title: vscode.l10n.t('Lets get the AST')

     });
```
4. **Specific Commands in Requests**:

   - The app processes specific commands within requests, such as 'funny' or 'dig', to generate appropriate responses.

   - Example:
```typescript
     if (request.command === 'funny') {

       // Process 'funny' command

     } else if (request.command === 'dig') {

       // Process 'dig' command

     }
```
These triggers ensure that the app responds to user actions and commands, processes the input, and generates the appropriate responses.


Here's a breakdown of the logic:

1. **Model Selection**:
  ```typescript
  const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);
  ```

- The code selects a language model using `vscode.lm.selectChatModels` with a `MODEL_SELECTOR`.

2. **Message Preparation**:
```typescript
   if (model) {

     const messages = [
       vscode.LanguageModelChatMessage.User('You are a cat! Your job is to explain computer science concepts in the funny manner of a cat. Always start your response by stating what concept you are explaining. Always include code samples.'),
       vscode.LanguageModelChatMessage.User(topic)
     ];
```
   - If a model is selected, it prepares a list of messages. The first message instructs the model to respond as a cat explaining computer science concepts humorously. The second message contains the topic to be explained.

3. **Sending Request and Handling Response**:
```typescript
   const chatResponse = await model.sendRequest(messages, {}, token);

   for await (const fragment of chatResponse.text) {

     stream.markdown(fragment);

   }
```
   - The code sends the prepared messages to the model and awaits the response. It then streams the response fragments as markdown to the `stream`.

4. **Error Handling**:
```typescript
   } catch(err) {

     handleError(logger, err, stream);

   }
```
   - If an error occurs during the process, it is caught and handled by the `handleError` function.

5. **Button Creation**:
```typescript
   stream.button({

     command: CODEARCHEO_AST_COMMAND_ID,

     title: vscode.l10n.t('Lets get the AST')

   });
```
   - A button is added to the stream with the command [`CODEARCHEO_AST_COMMAND_ID`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) and the title "Lets get the AST".

6. **Logging and Return**:
```typescript
   logger.logUsage('request', { kind: 'funny'});

   return { metadata: { command: 'funny' } };
```
   - The usage of the request is logged with the kind 'funny', and the function returns metadata indicating the command 'funny'.

7. **Handling 'dig' Command**:
```typescript
   } else if (request.command === 'dig') {

     stream.progress('Digging for secrets...');

     try {

       const [model] = await vscode.lm.selectChatModels(MODEL_SELECTOR);

       let documentText = '';

       if (model) {

         // Here's an example of how to use the prompt-tsx library to build a prompt
```
   - If the command is 'dig', it shows a progress message "Digging for secrets..." and attempts to select a model again. The rest of the logic for this command is not shown in the provided excerpt.



| **Objective**                                                | **Implementation**                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Create a VSCode extension for code archeology using Copilot chat | Implemented in [`src/extension.ts`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) |
| Replace Python function definitions with cat sounds          | Implemented in the `activate` function in [`src/extension.ts`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) using [`fragment.replaceAll('def', 'meow')`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) |
| Provide chat participants and commands for the extension     | Defined in the [`contributes`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) section of [`package.json`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) |
| Compile TypeScript code                                      | Configured in [`tsconfig.json`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) and executed via npm scripts in [`package.json`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) |
| Run and watch tests                                          | Configured in tasks.json and launch.json                     |
| Lint TypeScript code                                         | Configured in [`package.json`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) with ESLint and TypeScript ESLint plugins |

### Additional Key Points

- **Project Name**: [`codearcheo`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)

- **Publisher**: [`decyjphr`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)

- **Description**: VSCode Copilot Chat Extension for Code Archeology

- **Repository URL**: [GitHub Repository](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)

- Main Features

  :

  - Chat participants for natural language interaction with code
  - Commands to use cat names and AST in the editor

- Dependencies

  :

  - `@vscode/prompt-tsx`
  - `@types/node`
  - [`typescript`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)
  - `@types/vscode`
  - `@typescript-eslint/eslint-plugin`
  - `@typescript-eslint/parser`
  - [`eslint`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)

- Development Scripts

  :

  - [`compile`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html): Compiles the TypeScript code
  - [`lint`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html): Lints the TypeScript code
  - [`watch`](vscode-file://vscode-app/private/var/folders/5z/38q3q4j15zg34f5_sk5b1fzm0000gn/T/AppTranslocation/10611FDF-064C-4985-BC2E-D5CEC51F1662/d/Visual Studio Code - Insiders.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html): Watches for changes and recompiles the code

This repository aims to enhance code understanding and interaction using natural language processing and fun elements like cat sounds.