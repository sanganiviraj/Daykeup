# RepRift Agent Instructions

Please follow the development standards defined in [DEVELOPMENT_GUIDELINES.md](file:///Users/vandit/Documents/TechVersion/Projects/RepRift/RepRift/DEVELOPMENT_GUIDELINES.md) and [.agents/rules/development-standards.md](file:///Users/vandit/Documents/TechVersion/Projects/RepRift/RepRift/.agents/rules/development-standards.md) modeled directly after `hiper-ui-development`.

### Critical Enforcements:
- **Code Organization:** All app source code belongs in `app/`.
- **Naming & Files:** Kebab-case folders for components (`app-text/`), with paired `PascalCase.tsx` and `PascalCaseStyle.ts`.
- **Scaling:** Always use `moderateScale` (for typography), `verticalScale` (for heights/margins/paddings/radii), and `horizontalScale` (for widths/lateral spacing).
- **Colors:** Use `Colors.<key>` from `app/theme/Colors.ts`. No raw hex codes.
- **Strings:** Centralize all UI text in `app/constants/Strings.ts` with `Object.freeze`. No hardcoded strings in JSX.
- **Components:** Wrap with `memo`, use `<AppText>` instead of `<Text>`, and top-level screen with `<SafeAreaContainer>`.
