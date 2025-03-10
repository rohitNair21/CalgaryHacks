# SafeHaven

This is a React Native/TypeScript project created with [Expo](https://expo.dev) and [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

SafeHaven is a mobile app designed to support immigrant women facing domestic violence. It offers live chat with real-time translation, safe community spaces for peer support and a resource hub to locate help centres and find useful information.


## Tech

The backend of SafeHaven is powered by Firebase for users and chats, Google Maps API for location functionality as well as Google Translate API for real-time language translation. Clerk is used for low-level authentication to manage user sign-ins. Data is stored using Next.js and MongoDB, while AWS S3 handles cloud storage. To improve performance and efficiency, AWS CloudFront is used for caching.

On the frontend, SafeHaven features a modern, intuitive UI built with React Native. We utilize React Query and Expo Router to optimize data fetching and navigation, ensuring a quick and seamless user experience.

## Get started

To run SafeHaven locally, you'll need to set up the development environment and configure the necessary services.

### Prerequisites
Before running the application, ensure you have the following installed:
- Node.js & npm
- React Native (Expo) environment setup
- Firebase project configuration
- MongoDB instance
- AWS S3 credentials

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/safehaven.git
   cd safehaven
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file and adding the required keys.
   
4. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
