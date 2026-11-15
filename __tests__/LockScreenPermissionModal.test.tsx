import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { LockScreenPermissionModal } from '../app/components';
import { lockScreenPermissionString } from '../app/constants';

describe('LockScreenPermissionModal Component', () => {
  it('renders modal with Xiaomi guidance when isXiaomi is true', () => {
    const onOpenSettings = jest.fn();
    const onDismiss = jest.fn();

    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <LockScreenPermissionModal
          visible={true}
          isXiaomi={true}
          onOpenSettings={onOpenSettings}
          onDismiss={onDismiss}
        />,
      );
    });

    expect(tree).toBeDefined();
    const root = tree!.root;

    // Check title
    const title = root.findByProps({ children: lockScreenPermissionString.title });
    expect(title).toBeDefined();

    // Check Xiaomi subtitle
    const xiaomiSubtitle = root.findByProps({
      children: lockScreenPermissionString.subtitleXiaomi,
    });
    expect(xiaomiSubtitle).toBeDefined();

    // Check Xiaomi step 1
    const xiaomiStep1 = root.findByProps({
      children: lockScreenPermissionString.step1XiaomiTitle,
    });
    expect(xiaomiStep1).toBeDefined();
  });

  it('renders modal with general Android guidance when isXiaomi is false', () => {
    const onOpenSettings = jest.fn();
    const onDismiss = jest.fn();

    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <LockScreenPermissionModal
          visible={true}
          isXiaomi={false}
          onOpenSettings={onOpenSettings}
          onDismiss={onDismiss}
        />,
      );
    });

    expect(tree).toBeDefined();
    const root = tree!.root;

    // Check general subtitle
    const generalSubtitle = root.findByProps({
      children: lockScreenPermissionString.subtitleGeneral,
    });
    expect(generalSubtitle).toBeDefined();

    // Check general step 1
    const generalStep1 = root.findByProps({
      children: lockScreenPermissionString.step1GeneralTitle,
    });
    expect(generalStep1).toBeDefined();
  });

  it('calls onOpenSettings when primary button is clicked', () => {
    const onOpenSettings = jest.fn();
    const onDismiss = jest.fn();

    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <LockScreenPermissionModal
          visible={true}
          isXiaomi={true}
          onOpenSettings={onOpenSettings}
          onDismiss={onDismiss}
        />,
      );
    });

    const root = tree!.root;
    const primaryBtn = root.findByProps({
      accessibilityLabel: lockScreenPermissionString.openSettingsBtn,
    });
    expect(primaryBtn).toBeDefined();

    ReactTestRenderer.act(() => {
      primaryBtn.props.onPress();
    });

    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when close button is clicked', () => {
    const onOpenSettings = jest.fn();
    const onDismiss = jest.fn();

    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <LockScreenPermissionModal
          visible={true}
          isXiaomi={false}
          onOpenSettings={onOpenSettings}
          onDismiss={onDismiss}
        />,
      );
    });

    const root = tree!.root;
    const closeBtn = root.findByProps({
      accessibilityLabel: lockScreenPermissionString.close,
    });
    expect(closeBtn).toBeDefined();

    ReactTestRenderer.act(() => {
      closeBtn.props.onPress();
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onSecondaryAction when provided and secondary button is clicked', () => {
    const onOpenSettings = jest.fn();
    const onDismiss = jest.fn();
    const onSecondaryAction = jest.fn();

    let tree: ReactTestRenderer.ReactTestRenderer | undefined;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <LockScreenPermissionModal
          visible={true}
          isXiaomi={false}
          onOpenSettings={onOpenSettings}
          onDismiss={onDismiss}
          onSecondaryAction={onSecondaryAction}
          secondaryButtonText={lockScreenPermissionString.saveAnywayBtn}
        />,
      );
    });

    const root = tree!.root;
    const secondaryBtn = root.findByProps({
      accessibilityLabel: lockScreenPermissionString.saveAnywayBtn,
    });
    expect(secondaryBtn).toBeDefined();

    ReactTestRenderer.act(() => {
      secondaryBtn.props.onPress();
    });

    expect(onSecondaryAction).toHaveBeenCalledTimes(1);
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
