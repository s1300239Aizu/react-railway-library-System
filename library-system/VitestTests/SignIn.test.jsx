import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../src/Login';

test('フォームとボタンが正しくレンダリングされているかテスト', () => {
  const { getByLabelText, getByText } = render(
    <Router>
      <Login />
    </Router>
  );

  expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/パスワード/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /ログイン/i })).toBeInTheDocument();
});
