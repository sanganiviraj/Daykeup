import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { BottomNavigation } from '../app/components';
import { homeScreenString } from '../app/constants';

describe('BottomNavigation Component', () => {
  it('renders Main and Alarms tabs with add action button', () => {
    const onTabPress = jest.fn();
    const onAddPress = jest.fn();

    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <BottomNavigation
          currentTab="main"
          onTabPress={onTabPress}
          onAddPress={onAddPress}
        />,
      );
    });

    expect(tree).toBeDefined();
    const root = tree!.root;

    // Verify Tab buttons and Floating Add button exist by label
    const mainTab = root.findByProps({ accessibilityLabel: homeScreenString.mainTab });
    const alarmsTab = root.findByProps({ accessibilityLabel: homeScreenString.alarmsTab });
    const addButton = root.findByProps({ accessibilityLabel: homeScreenString.createAlarmBtn });

    expect(mainTab).toBeDefined();
    expect(alarmsTab).toBeDefined();
    expect(addButton).toBeDefined();
  });

  it('triggers onTabPress when switching to alarms', () => {
    const onTabPress = jest.fn();
    const onAddPress = jest.fn();

    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <BottomNavigation
          currentTab="main"
          onTabPress={onTabPress}
          onAddPress={onAddPress}
        />,
      );
    });

    const root = tree!.root;
    const alarmsTab = root.findByProps({ accessibilityLabel: homeScreenString.alarmsTab });

    ReactTestRenderer.act(() => {
      alarmsTab.props.onPress();
    });

    expect(onTabPress).toHaveBeenCalledWith('alarms');
  });

  it('triggers onAddPress when plus button is tapped', () => {
    const onTabPress = jest.fn();
    const onAddPress = jest.fn();

    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <BottomNavigation
          currentTab="alarms"
          onTabPress={onTabPress}
          onAddPress={onAddPress}
        />,
      );
    });

    const root = tree!.root;
    const addButton = root.findByProps({ accessibilityLabel: homeScreenString.createAlarmBtn });

    ReactTestRenderer.act(() => {
      addButton.props.onPress();
    });

    expect(onAddPress).toHaveBeenCalledTimes(1);
  });
});
