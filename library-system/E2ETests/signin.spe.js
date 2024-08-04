import { test, expect } from "@playwright/test";

test("SignIn 入力フォームテスト", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    await page.fill('.email-input', 'test@test.ac.jp');
    await page.fill('.password-input', 'password');

    const email = await page.inputValue('.email-input');
    const password = await page.inputValue('.password-input');

    const isAscii = (str) => /^[\x00-\x7F]*$/.test(str);
    const isValidEmail = (email) => isAscii(email) && email.includes('@');

    expect(isValidEmail(email)).toBe(true);
    expect(isAscii(password)).toBe(true);
});
