// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tag } from '../ui/Tag';
import { Kbd } from '../ui/Kbd';

describe('Tag', () => {
  it('renders children text', () => {
    render(<Tag>hello</Tag>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('renders with className', () => {
    render(<Tag className="custom">tag</Tag>);
    expect(screen.getByText('tag')).toHaveClass('custom');
  });
});

describe('Kbd', () => {
  it('renders keyboard shortcut', () => {
    render(<Kbd>⌘K</Kbd>);
    expect(screen.getByText('⌘K')).toBeInTheDocument();
    expect(screen.getByText('⌘K').tagName).toBe('KBD');
  });
});
