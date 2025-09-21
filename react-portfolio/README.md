# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\nOpen [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\nYou may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\nSee the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\nIt correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\nYour app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


## JWT Authentication

The heart of why JWT (JSON Web Tokens) is a modern and secure standard for authentication.

Let's clarify a crucial point: You should never store a user's password in local storage or cookies. Storing passwords on the client-side is a major security risk.

Here’s a breakdown of why we use JWTs instead:

### The Problem with Storing Passwords
*   **Local Storage:** Is easily accessible by any JavaScript code running on your page. If your site has even a small Cross-Site Scripting (XSS) vulnerability, an attacker could steal the user's password.
*   **Cookies:** If you store the password in a regular cookie, it's just as vulnerable to XSS as local storage.

### How JWT Solves This Problem
A JWT is not a password; it's a **token** or a temporary "pass" that proves a user has already successfully logged in with their password.

Here's the flow we've implemented in your application:

1.  **Login Request:** The user enters their username and password in the login form. This information is sent to the server *once* over a secure connection.

2.  **Server Verification:** Your `server.js` takes the password, hashes it, and compares it to the hashed password stored in the database (`userDB` in our case). It **never** stores or works with the plain text password.

3.  **Token Generation:** If the password is correct, the server generates a JWT. This token contains:
    *   **Payload:** Information about the user (like `userId` and `username`).
    *   **Expiration Date:** We set this to 3 minutes.
    *   **Signature:** A cryptographic signature that the server uses to verify that the token is authentic and has not been tampered with.

4.  **Token is Sent to Client:** The server sends this JWT to the client inside an `httpOnly` cookie.
    *   `httpOnly` is a critical security measure. It means the cookie cannot be accessed by JavaScript, which protects it from XSS attacks.

5.  **Subsequent Requests:** For every subsequent request to a protected route (like `/api/profile`), the browser automatically sends the JWT cookie back to the server. Your `authenticateToken` middleware then:
    *   Verifies the token's signature to ensure it's authentic.
    *   Checks the expiration date.
    *   If both are valid, it trusts the information in the token and grants access.

### Key Benefits of Using JWT
*   **Enhanced Security:** The user's actual password is not stored on the client, significantly reducing the risk of theft.
*   **Stateless Authentication:** The server doesn't need to keep track of logged-in users in memory. All the necessary information is in the self-contained token. This makes your application more scalable.
*   **Controlled Expiration:** The automatic 3-minute logout is possible because the token itself has a built-in expiration time that the server enforces.


## Advanced Session Management

To provide a more seamless and secure user experience, we have implemented an advanced session management system that includes an inactivity timer and automatic token refresh.

### Inactivity Timer

*   **Automatic Logout:** If you are inactive for 3 minutes (no mouse movement or key presses), you will be automatically logged out.
*   **How it Works:** A custom hook, `useInactivity`, monitors user activity. If no activity is detected for the specified duration, it triggers the logout process.

### Refresh Token

*   **The Problem:** Short-lived access tokens (like our 3-minute token) are great for security, but they can be inconvenient for active users who would have to log in again every 3 minutes.
*   **The Solution:** When you log in, the server now issues two tokens:
    *   A short-lived **Access Token** (3 minutes).
    *   A long-lived **Refresh Token** (7 days).
*   **Automatic Refresh:** As long as you are active on the site, the application will use the refresh token to silently get a new access token from the server before the old one expires. This happens automatically in the background.

### The Combined Flow

This combination of an inactivity timer and refresh tokens provides the best of both worlds:

*   **Security:** Inactive users are logged out quickly, reducing the risk of unauthorized access from an unattended computer.
*   **Convenience:** Active users can enjoy a continuous session without being interrupted to log in again.