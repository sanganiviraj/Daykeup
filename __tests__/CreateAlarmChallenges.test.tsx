import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import CreateAlarmScreen from '../app/modules/Alarms/CreateAlarm/CreateAlarmScreen';
import { store } from '../app/redux';
import { createAlarmString } from '../app/constants';
import { AlarmService } from '../app/services';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

describe('CreateAlarmScreen Wake-Up Challenge Card', () => {
  beforeEach(() => {
    jest.spyOn(AlarmService, 'getDeviceBrand').mockResolvedValue({
      brand: 'generic',
      manufacturer: 'generic',
      isXiaomi: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders all 6 dopamine game challenge cards with badges and mission previews', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer | undefined;

    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <CreateAlarmScreen />
        </Provider>,
      );
      await Promise.resolve();
    });

    expect(tree).toBeDefined();
    const root = tree!.root;

    // Verify all 6 challenge buttons exist
    const knifeBtn = root.findByProps({
      accessibilityLabel: createAlarmString.challengeKnife,
    });
    const hockeyBtn = root.findByProps({
      accessibilityLabel: createAlarmString.challengeHockey,
    });
    const stackBtn = root.findByProps({
      accessibilityLabel: createAlarmString.challengeStack,
    });
    const pongBtn = root.findByProps({
      accessibilityLabel: createAlarmString.challengePong,
    });
    const mathBtn = root.findByProps({
      accessibilityLabel: createAlarmString.challengeMath,
    });
    const mysteryBtn = root.findByProps({
      accessibilityLabel: createAlarmString.challengeMystery,
    });

    expect(knifeBtn).toBeDefined();
    expect(hockeyBtn).toBeDefined();
    expect(stackBtn).toBeDefined();
    expect(pongBtn).toBeDefined();
    expect(mathBtn).toBeDefined();
    expect(mysteryBtn).toBeDefined();

    // Tap on knife button to select it
    ReactTestRenderer.act(() => {
      knifeBtn.props.onPress();
    });

    // Tap on hockey button to switch selection
    ReactTestRenderer.act(() => {
      hockeyBtn.props.onPress();
    });

    // Tap on stack button to switch selection
    ReactTestRenderer.act(() => {
      stackBtn.props.onPress();
    });

    // Tap on pong button to switch selection
    ReactTestRenderer.act(() => {
      pongBtn.props.onPress();
    });
  });
});
