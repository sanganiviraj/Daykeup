import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {
  KnifeThrowerGame,
  AirHockeyGame,
  StackTowerGame,
  CurvePongGame,
} from '../app/components';

describe('Dopamine Mini-Games', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('KnifeThrowerGame', () => {
    it('renders cleanly and mounts WebView engine', () => {
      let tree: ReactTestRenderer.ReactTestRenderer | undefined;
      ReactTestRenderer.act(() => {
        tree = ReactTestRenderer.create(
          <KnifeThrowerGame totalKnives={7} initialKnivesCount={0} />,
        );
      });

      expect(tree).toBeDefined();

      ReactTestRenderer.act(() => {
        tree?.unmount();
      });
    });
  });

  describe('AirHockeyGame', () => {
    it('renders cleanly and mounts WebView engine', () => {
      let tree: ReactTestRenderer.ReactTestRenderer | undefined;
      ReactTestRenderer.act(() => {
        tree = ReactTestRenderer.create(<AirHockeyGame targetScore={2} />);
      });

      expect(tree).toBeDefined();

      ReactTestRenderer.act(() => {
        tree?.unmount();
      });
    });
  });

  describe('StackTowerGame', () => {
    it('renders cleanly and mounts WebView engine', () => {
      let tree: ReactTestRenderer.ReactTestRenderer | undefined;
      ReactTestRenderer.act(() => {
        tree = ReactTestRenderer.create(<StackTowerGame targetHeight={10} />);
      });

      expect(tree).toBeDefined();

      ReactTestRenderer.act(() => {
        tree?.unmount();
      });
    });
  });

  describe('CurvePongGame', () => {
    it('renders cleanly and mounts WebView engine', () => {
      let tree: ReactTestRenderer.ReactTestRenderer | undefined;
      ReactTestRenderer.act(() => {
        tree = ReactTestRenderer.create(<CurvePongGame targetScore={2} />);
      });

      expect(tree).toBeDefined();

      ReactTestRenderer.act(() => {
        tree?.unmount();
      });
    });
  });
});
