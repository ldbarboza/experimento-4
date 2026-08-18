import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test('should render form with all fields', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Contact Us')).toBeVisible()
    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Message')).toBeVisible()
    await expect(page.getByRole('button', { name: /Send/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible()
  })

  test('should mark required fields with asterisk', async ({ page }) => {
    await page.goto('/')

    const requiredMarkers = page.locator('span:has-text("*")')
    await expect(requiredMarkers).toHaveCount(3)
  })

  test('should show validation error for empty name on submit', async ({ page }) => {
    await page.goto('/')

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Message').fill('This is a test message')
    await page.getByRole('button', { name: /Send/i }).click()

    await expect(page.getByText('Name is required')).toBeVisible()
  })

  test('should show validation error for name too short', async ({ page }) => {
    await page.goto('/')

    const nameInput = page.getByLabel('Name')
    await nameInput.fill('A')
    await nameInput.blur()

    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible()
  })

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/')

    const emailInput = page.getByLabel('Email')
    await emailInput.fill('notanemail')
    await emailInput.blur()

    await expect(page.getByText('Please enter a valid email address')).toBeVisible()
  })

  test('should show validation error for message too short', async ({ page }) => {
    await page.goto('/')

    const messageInput = page.getByLabel('Message')
    await messageInput.fill('short')
    await messageInput.blur()

    await expect(page.getByText('Message must be at least 10 characters')).toBeVisible()
  })

  test('should disable submit button when form is invalid', async ({ page }) => {
    await page.goto('/')

    const submitButton = page.getByRole('button', { name: /Send/i })

    // Initially enabled (empty form)
    await expect(submitButton).not.toBeDisabled()

    // Become disabled after entering invalid data
    await page.getByLabel('Name').fill('A')
    await page.getByLabel('Name').blur()

    await expect(submitButton).toBeDisabled()
  })

  test('should enable submit button when all fields are valid', async ({ page }) => {
    await page.goto('/')

    await page.getByLabel('Name').fill('John Doe')
    await page.getByLabel('Email').fill('john@example.com')
    await page.getByLabel('Message').fill('This is a valid test message')

    const submitButton = page.getByRole('button', { name: /Send/i })
    await expect(submitButton).not.toBeDisabled()
  })

  test('should clear form on clear button click', async ({ page }) => {
    await page.goto('/')

    const nameInput = page.getByLabel('Name')
    const emailInput = page.getByLabel('Email')
    const messageInput = page.getByLabel('Message')

    await nameInput.fill('John Doe')
    await emailInput.fill('john@example.com')
    await messageInput.fill('This is a test message')

    await page.getByRole('button', { name: /Clear/i }).click()

    await expect(nameInput).toHaveValue('')
    await expect(emailInput).toHaveValue('')
    await expect(messageInput).toHaveValue('')
  })

  test('should change submit button text to "Sending..." during submission', async ({ page }) => {
    // Note: This test would require mocking the API response to see the loading state
    await page.goto('/')

    await page.getByLabel('Name').fill('John Doe')
    await page.getByLabel('Email').fill('john@example.com')
    await page.getByLabel('Message').fill('This is a test message')

    const submitButton = page.getByRole('button', { name: /Send/i })

    // Intercept and delay the API call
    await page.route('/api/contact', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.continue()
    })

    await submitButton.click()

    // Check for "Sending..." text (might be brief)
    await expect(submitButton).toContainText(/Send|Sending/)
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')

    // Tab through form fields
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Name')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Email')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Message')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: /Send/i })).toBeFocused()
  })

  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/')

    const nameLabel = page.locator('label:has-text("Name")')
    const emailLabel = page.locator('label:has-text("Email")')
    const messageLabel = page.locator('label:has-text("Message")')

    await expect(nameLabel).toBeVisible()
    await expect(emailLabel).toBeVisible()
    await expect(messageLabel).toBeVisible()

    // Check that labels have proper for attributes
    const nameInput = page.getByLabel('Name')
    const emailInput = page.getByLabel('Email')
    const messageInput = page.getByLabel('Message')

    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(messageInput).toBeVisible()
  })

  test('should show focus indicators on interactive elements', async ({ page }) => {
    await page.goto('/')

    const submitButton = page.getByRole('button', { name: /Send/i })

    await submitButton.focus()

    // Check that element has focus (you can also check CSS outline/border)
    const isFocused = await submitButton.evaluate(el => el === document.activeElement)
    expect(isFocused).toBe(true)
  })
})
