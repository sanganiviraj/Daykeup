# RepRift — Development & Architectural Guidelines

This document outlines the strict engineering standards, file structures, coding conventions, responsive scaling, and design-token guidelines for the **RepRift** mobile application.

These standards are modeled directly after the **`hiper-ui-development`** enterprise React Native architecture. Every developer and AI assistant working on RepRift **must strictly follow these rules**.

---

## 1. Directory & File Structure

The application code resides inside an `app/` root directory. Do not place business logic, screens, or components directly in the repository root.

```
app/
├── api/                        # Network & API layer
│   ├── axios/
│   │   ├── axiosClient.ts     # Axios instance & request/response interceptors
│   │   ├── axiosEndPoint.ts   # Base URLs and environment endpoints
│   │   └── index.ts
│   └── index.ts
├── assets/                     # Static media & resources
│   ├── fonts/                 # Custom font assets (.ttf / .otf)
│   ├── Icons/                 # Raster icons (png/webp)
│   ├── Images/                # Illustrations & image assets
│   ├── svgs/                  # React Native SVG component exports
│   └── index.ts               # Font and asset bundle exports
├── components/                 # Shared, atomic, and reusable UI components
│   ├── app-text/              # Typography wrapper component
│   │   ├── AppText.tsx
│   │   └── AppTextStyle.ts
│   ├── custom-button/         # Standard button component
│   │   ├── CustomButton.tsx
│   │   └── CustomButtonStyle.ts
│   ├── safe-area-container/   # Screen wrapper with safe area & status bar
│   │   ├── SafeAreaContainer.tsx
│   │   └── SafeAreaContainerStyle.ts
│   └── index.ts               # Barrel export for all components
├── constants/                  # Constant configuration & localized strings
│   ├── EndPoint.ts            # API URL endpoints
│   ├── Routes.ts              # Route name constants (as const)
│   ├── Strings.ts             # Centralized UI strings (Object.freeze)
│   └── index.ts
├── hooks/                      # Custom React and Redux hooks
│   ├── ReduxHooks.ts          # Typed useAppDispatch and useAppSelector
│   └── index.ts
├── modules/                    # Application feature modules & screens
│   ├── Auth/
│   │   ├── SignIn/
│   │   │   ├── SignInScreen.tsx
│   │   │   └── SignInScreenStyles.ts
│   │   └── SignUp/
│   ├── Home/
│   │   ├── HomeScreen.tsx
│   │   └── HomeScreenStyles.ts
│   └── ...
├── navigation/                 # Navigation stacks and tabs
│   ├── stack-navigation/
│   │   ├── RootStack.tsx
│   │   ├── AuthStack.tsx
│   │   ├── HomeStack.tsx
│   │   └── LoggedInStack.tsx
│   ├── tab-navigation/
│   │   └── TabNavigation.tsx
│   └── index.ts
├── redux/                      # Redux Toolkit state management
│   ├── reducers/              # Async thunks organized in kebab-case folders
│   │   ├── auth-reducers/
│   │   │   └── AuthReducers.ts
│   │   └── ...
│   ├── slices/                # State slices organized in kebab-case folders
│   │   ├── auth-slice/
│   │   │   └── AuthSlice.ts
│   │   └── ...
│   ├── Store.ts               # Store configuration & redux-persist
│   └── index.ts
├── services/                   # App-wide services
│   ├── NavigationService.ts   # Navigation container ref & helper
│   └── index.ts
├── theme/                      # Styling tokens & responsive scaling
│   ├── Colors.ts              # Central color palette (Hex codes & types)
│   ├── Metrics.ts             # Scaling functions (horizontal, vertical, moderate)
│   └── index.ts
├── types/                      # Global TypeScript definitions
│   ├── GlobalTypes.ts         # Central types, interfaces, navigation params
│   └── index.ts
└── utils/                      # Helper functions and global styling utilities
    ├── GlobalFunctions.ts     # General helper functions & formatters
    ├── GlobalStyles.ts        # Common flexbox and layout hooks
    ├── AppAlerts.ts           # System alerts & notification handlers
    └── index.ts
```

---

## 2. Naming Conventions

| Item | Convention | Example |
| :--- | :--- | :--- |
| **Component Directories** | `kebab-case` | `app/components/custom-button/` |
| **Component Files** | `PascalCase.tsx` | `CustomButton.tsx` |
| **Component Styles** | `PascalCaseStyle.ts` | `CustomButtonStyle.ts` |
| **Module / Screen Folders** | `PascalCase` | `app/modules/Auth/`, `app/modules/Home/` |
| **Screen Files** | `[Name]Screen.tsx` | `SignInScreen.tsx`, `HomeScreen.tsx` |
| **Screen Styles** | `[Name]ScreenStyles.ts` | `SignInScreenStyles.ts`, `HomeScreenStyles.ts` |
| **Redux Slice Folders** | `kebab-case` | `app/redux/slices/auth-slice/` |
| **Redux Slice Files** | `PascalCase.ts` | `AuthSlice.ts` |
| **Redux Reducer Folders** | `kebab-case` | `app/redux/reducers/auth-reducers/` |
| **Redux Reducer Files** | `PascalCase.ts` | `AuthReducers.ts` |
| **Navigation Stacks** | `PascalCase.tsx` | `RootStack.tsx`, `AuthStack.tsx` |
| **Constants & Routes** | `PascalCase.ts` | `Routes.ts`, `Strings.ts`, `EndPoint.ts` |
| **Theme Files** | `PascalCase.ts` | `Colors.ts`, `Metrics.ts` |
| **TypeScript Types** | `PascalCase` | `CustomButtonProps`, `UserPayload` |

---

## 3. Responsive Scaling Rules (`app/theme/Metrics.ts`)

To ensure seamless responsive rendering across all screen sizes (phones, foldables, tablets):

### Baseline Dimensions:
- **Guideline Width:** `375`
- **Guideline Height:** `812`
- Responsive dimensions auto-swap if device is in landscape mode (`width > height`).

### Scaling Helpers:
```typescript
import { Dimensions, Platform } from 'react-native';

const { height, width } = Dimensions.get('window');

let guidelineBaseWidth = 375;
let guidelineBaseHeight = 812;

if (width > height) {
  [guidelineBaseWidth, guidelineBaseHeight] = [guidelineBaseHeight, guidelineBaseWidth];
}

export const horizontalScale = (size: number): number => (width / guidelineBaseWidth) * size;
export const verticalScale = (size: number): number => (height / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5): number =>
  size + (horizontalScale(size) - size) * factor;

export const globalMetrics = {
  isAndroid: Platform.OS === 'android',
  isIos: Platform.OS === 'ios',
  isPad: Platform.OS === 'ios' && Platform.isPad,
  isTV: Platform.isTV,
};

export { height, width };
```

### Strict Scaling Usage Rules:
1. **Typography (`fontSize`, `lineHeight`):** **MUST ALWAYS** use `moderateScale(size)`.
2. **Vertical Dimensions:** `height`, `minHeight`, `maxHeight`, `paddingTop`, `paddingBottom`, `paddingVertical`, `marginTop`, `marginBottom`, `marginVertical`, `top`, `bottom`, `borderRadius`, `borderWidth` **MUST ALWAYS** use `verticalScale(size)`.
3. **Horizontal Dimensions:** `width`, `minWidth`, `maxWidth`, `paddingLeft`, `paddingRight`, `paddingHorizontal`, `marginLeft`, `marginRight`, `marginHorizontal`, `left`, `right` **MUST ALWAYS** use `horizontalScale(size)` (or `moderateScale(size)` when subtle scaling is desired).
4. **NO Raw Numbers:** Do not use unscaled numerical dimensions for spacing or sizing (e.g., `padding: 16` is prohibited; use `padding: verticalScale(16)`).
   *(Exceptions: `flex: 1`, `zIndex`, `opacity`, `aspectRatio`)*.

---

## 4. Theme & Color Standards (`app/theme/Colors.ts`)

1. **Centralized Palette:** All colors must be declared as hexadecimal values in `app/theme/Colors.ts`.
2. **Strictly Typed:** Every color key is defined in the `ColorType` union:
```typescript
type ColorType =
  | 'primary'
  | 'primaryBackground'
  | 'primaryText'
  | 'secondaryBackground'
  | 'secondaryText'
  | 'cardBackground'
  | 'border'
  | 'error'
  | 'success'
  | 'transparent';

export const Colors: Record<ColorType, string> = {
  primary: '#10B981',
  primaryBackground: '#F9F9F8',
  primaryText: '#111827',
  secondaryBackground: '#FFFFFF',
  secondaryText: '#6B7280',
  cardBackground: '#FFFFFF',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  transparent: 'transparent',
};
```
3. **No Inline Hex Colors:** Never write `#10b981` or `rgb(...)` directly inside stylesheets or components. Always reference `Colors.<key>`.

---

## 5. String Constants & Localization (`app/constants/Strings.ts`)

1. **Zero Hardcoded Strings:** Text in components, headers, buttons, placeholders, and error toasts **MUST NOT** be hardcoded in `.tsx` files.
2. **Immutability with `Object.freeze`:**
```typescript
export const commonString = Object.freeze({
  somethingWentWrong: 'Something went wrong!',
  continue: 'Continue',
  cancel: 'Cancel',
  save: 'Save',
  retry: 'Retry',
});

export const authScreenString = Object.freeze({
  signIn: 'Sign In',
  signUp: 'Create Account',
  emailPlaceholder: 'Enter your email',
  passwordPlaceholder: 'Enter your password',
});
```
3. Group strings logically by screen or domain module.

---

## 6. Route Constants (`app/constants/Routes.ts`)

Never pass raw strings to navigation methods (e.g. `navigation.navigate('HomeScreen')`). Always use `Routes`:

```typescript
export default {
  // Stacks
  rootStack: 'RootStack',
  authStack: 'AuthStack',
  loggedInStack: 'LoggedInStack',
  tabStack: 'TabStack',
  
  // Auth Screens
  signIn: 'SignInScreen',
  signUp: 'SignUpScreen',
  forgotPassword: 'ForgotPasswordScreen',
  
  // App Screens
  home: 'HomeScreen',
  workout: 'WorkoutScreen',
  profile: 'ProfileScreen',
} as const;
```

---

## 7. Component Architecture & Coding Standards

### 1. Functional Components & Memoization
- All reusable components must be functional components wrapped in `React.memo` to eliminate unnecessary re-renders:
```typescript
import React, { memo } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import AppText from '../app-text/AppText';
import { styles } from './CustomButtonStyle';
import { CustomButtonProps } from '../../types';

const CustomButton = (props: CustomButtonProps & TouchableOpacityProps) => {
  return (
    <TouchableOpacity
      {...props}
      style={[styles.buttonContainerStyle, props.style]}
      activeOpacity={0.7}
      accessible={props.accessible ?? true}
      accessibilityLabel={props.accessibilityLabel || props.title}
      accessibilityRole={props.accessibilityRole || 'button'}
      testID={props.testID || ''}>
      <AppText style={[styles.titleTextStyle, props.titleTextStyle]}>
        {props.title}
      </AppText>
    </TouchableOpacity>
  );
};

export default memo(CustomButton);
```

### 2. Separation of Styles
- Component styles must live in a separate `[ComponentName]Style.ts` file in the same folder.
- Export styles using `export const styles = StyleSheet.create({ ... });`.
- No large inline `style={{ ... }}` objects in JSX.

### 3. Typography Wrapper (`AppText`)
- **NEVER** use React Native's default `<Text>` component directly in screens or custom components.
- Always import and use `<AppText>` from `app/components/` to guarantee standardized scaling, font family, and default text color.

### 4. Screen Layout Wrapper (`SafeAreaContainer`)
- Every top-level screen must wrap its root content with `<SafeAreaContainer>`:
```typescript
import React, { FC, memo } from 'react';
import { View } from 'react-native';
import { SafeAreaContainer, CustomHeader } from '../../components';
import { styles } from './HomeScreenStyles';

const HomeScreen: FC = () => {
  return (
    <SafeAreaContainer edges={['top', 'left', 'right']}>
      <CustomHeader title="Dashboard" />
      <View style={styles.container}>
        {/* Screen content */}
      </View>
    </SafeAreaContainer>
  );
};

export default memo(HomeScreen);
```

### 5. Accessibility & Testability
- All interactive components (buttons, text inputs, toggles, list items) must support and pass:
  - `accessible`
  - `accessibilityLabel`
  - `accessibilityRole`
  - `testID`

---

## 8. State Management (Redux Toolkit)

1. **Structure:**
   - Slices in `app/redux/slices/<feature>-slice/<Feature>Slice.ts`.
   - Async Thunks in `app/redux/reducers/<feature>-reducers/<Feature>Reducers.ts`.
   - Store configured in `app/redux/Store.ts`.
2. **Typed Hooks:**
   - Always use `useAppDispatch()` and `useAppSelector()` from `app/hooks/ReduxHooks.ts`. Never use raw `useDispatch` or `useSelector`.
3. **Immutability & Persistence:**
   - Use `redux-persist` with AsyncStorage for persisting key slices (e.g. auth tokens, settings).

---

## 9. API & Networking Architecture (`app/api/`)

1. **Single Client Instance:**
   - Use `app/api/axios/axiosClient.ts`.
   - Setup request interceptors to inject Authorization Bearer tokens from the Redux store.
   - Setup response interceptors for global error handling, unauthorized token refresh, and network failure toasts.
2. **Endpoints:**
   - Maintain endpoints in `app/constants/EndPoint.ts` or `app/api/axios/axiosEndPoint.ts`.

---

## 10. Summary Checklist for Code Reviews

Before committing or completing any feature:
- [ ] Code is organized in `app/` adhering to the folder structure.
- [ ] Component is in `kebab-case` folder with `PascalCase.tsx` and `PascalCaseStyle.ts`.
- [ ] All typography uses `AppText` with `moderateScale(fontSize)`.
- [ ] All dimensions/margins/paddings use `verticalScale` or `horizontalScale`.
- [ ] All colors are referenced via `Colors.<key>` from `app/theme/Colors.ts`.
- [ ] All strings are declared in `app/constants/Strings.ts` with `Object.freeze`.
- [ ] Routes are referenced via `Routes.<key>` from `app/constants/Routes.ts`.
- [ ] Components are wrapped with `React.memo()`.
- [ ] TypeScript types are explicitly declared without `any`.
- [ ] Accessibility attributes (`accessibilityLabel`, `accessibilityRole`, `testID`) are present on interactive elements.
