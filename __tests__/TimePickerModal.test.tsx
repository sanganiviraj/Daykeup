import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { TimePickerModal } from '../app/components';
import { commonString, createAlarmString } from '../app/constants';
import { calculateRestDuration, getCurrentTime12 } from '../app/utils';
import { getScrollOffset, ITEM_HEIGHT } from '../app/components/time-picker-modal/TimePickerModalStyle';

describe('TimePickerModal Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders modal with initial hour, minute, and period when visible', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <TimePickerModal
          visible={true}
          initialHour="07"
          initialMinute="45"
          initialPeriod="AM"
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      );
      jest.advanceTimersByTime(100);
    });

    expect(tree).toBeDefined();
    const root = tree!.root;

    // Check title is rendered
    const title = root.findByProps({ children: createAlarmString.selectTimeModalTitle });
    expect(title).toBeDefined();

    // Check time preview is rendered
    const timePreview = root.findByProps({ children: '07:45' });
    expect(timePreview).toBeDefined();

    ReactTestRenderer.act(() => {
      tree?.unmount();
    });
  });

  it('selects new hour, minute, period and confirms', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <TimePickerModal
          visible={true}
          initialHour="06"
          initialMinute="30"
          initialPeriod="AM"
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      );
      jest.advanceTimersByTime(100);
    });

    const root = tree!.root;

    // Select hour 08
    const hourBtn = root.findByProps({ accessibilityLabel: 'Hour 08' });
    ReactTestRenderer.act(() => {
      hourBtn.props.onPress();
    });

    // Select minute 15
    const minuteBtn = root.findByProps({ accessibilityLabel: 'Minute 15' });
    ReactTestRenderer.act(() => {
      minuteBtn.props.onPress();
    });

    // Select PM
    const pmBtn = root.findByProps({ accessibilityLabel: 'PM' });
    ReactTestRenderer.act(() => {
      pmBtn.props.onPress();
    });

    // Verify preview updated
    const updatedTimePreview = root.findByProps({ children: '08:15' });
    expect(updatedTimePreview).toBeDefined();

    // Confirm
    const confirmBtn = root.findByProps({
      accessibilityLabel: createAlarmString.confirmTimeBtn,
    });
    ReactTestRenderer.act(() => {
      confirmBtn.props.onPress();
    });

    expect(onConfirm).toHaveBeenCalledWith('08', '15', 'PM');

    ReactTestRenderer.act(() => {
      tree?.unmount();
    });
  });

  it('triggers onCancel when close button or cancel button is pressed', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <TimePickerModal
          visible={true}
          initialHour="06"
          initialMinute="30"
          initialPeriod="AM"
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      );
      jest.advanceTimersByTime(100);
    });

    const root = tree!.root;

    // Press Cancel button
    const cancelBtn = root.findByProps({ accessibilityLabel: commonString.cancel });
    ReactTestRenderer.act(() => {
      cancelBtn.props.onPress();
    });

    expect(onCancel).toHaveBeenCalledTimes(1);

    ReactTestRenderer.act(() => {
      tree?.unmount();
    });
  });

  it('calculates getScrollOffset correctly for hours and minutes', () => {
    expect(ITEM_HEIGHT).toBeGreaterThan(0);
    expect(getScrollOffset(0)).toBe(0);
    expect(getScrollOffset(5)).toBeGreaterThan(0);
    expect(getScrollOffset(30)).toBeGreaterThan(getScrollOffset(10));
  });

  it('getCurrentTime12 returns valid 12-hour formatted time and calculateRestDuration formats rest', () => {
    const fixedDate = new Date('2026-11-13T14:35:00');
    const time = getCurrentTime12(fixedDate);
    expect(time.hour).toBe('02');
    expect(time.minute).toBe('35');
    expect(time.period).toBe('PM');

    const rest = calculateRestDuration('03', '35', 'PM', fixedDate);
    expect(rest).toBe('1h 0m of rest');
  });
});

