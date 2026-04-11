#Update from this branch
#Routes
- new dependency `react-router-dom`
- added routes for login page and register and public event 
- Wrapped application in QueryClientProvider (prereqs dependency: `@tanstack/react-query`) in the app.tsx
- also created .env for api_url please rename .env.txt -> .env so that you can use it

#API Services loc: src/services
- api.ts: has base apiFetch func that automatically handles JWT auth headers and 401 error response
- authStore.ts Added token management `get, set, clear` for user session handling
- apiAuth.ts: created API wrappers for /auth/login, /auth/register, /user/me and auth/logout
- apiEvent.ts: standardized events fetching API wrapper

#Authentication Hook loc: src/features/authentication
- `useLogin.ts`: for login mutation, stores the token, invalidates user data, and dashboard redirection.
- `useRegister.ts`: handles user registration API calls and presents success/error toasts(not sonner but react-hot-toast).
- `useUser.ts`: queries the current logged user and determines authentication/admin status.
- `useLogout.ts`: clears cache and redirects the user back to the login page upon logging out.

#UI update 
- `LoginPage.tsx`: removed the form submission because the useLogin hook already handles it also added loading states
- `RegisterPage.tsx`: imported useRegister hook

#Prettier
-updated package scripts for formatting
