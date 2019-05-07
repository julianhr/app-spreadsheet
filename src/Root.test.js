import React from 'react';
import { create } from 'react-test-renderer'
import ReactDOM from 'react-dom';
import Root from './Root';


it('renders without crashing', () => {
  expect(() => create(<Root />)).not.toThrow()
})
