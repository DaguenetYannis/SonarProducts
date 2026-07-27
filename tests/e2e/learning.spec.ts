import { test, expect } from "@playwright/test";

test.describe("learning app shell", () => {
  test("shows imported Sonar learning levels", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Sonar Products" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Glossary/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Product and Vocabulary Foundations" })).toBeVisible();
    await expect(page.getByText("18 questions").first()).toBeVisible();
  });

  test("exposes installable app metadata", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.webmanifest");
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#090b10");
  });

  test("serves a static offline study mode", async ({ page }) => {
    await page.goto("/offline");
    await expect(page.getByRole("heading", { name: "Sonar Products" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Install app" })).toBeVisible();
    await page.getByRole("link", { name: /Product and Vocabulary Foundations/ }).click();
    await expect(page).toHaveURL(/\/offline\/levels\/product-and-vocabulary-foundations/);
    await expect(page.getByRole("heading", { name: "Product and Vocabulary Foundations" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Main menu" })).toBeVisible();
    await expect(page.getByRole("button", { name: "What does Connected Mode add to SonarQube for IDE?" })).toBeVisible();
  });

  test("shows glossary terms with cross-links", async ({ page }) => {
    await page.goto("/offline/glossary");
    await expect(page.getByRole("heading", { name: "Glossary" })).toBeVisible();
    await expect(page.locator("#code-smell")).toContainText("maintainability");
    await expect(page.locator("#sdlc")).toContainText("Software Development Life Cycle");
    await expect(page.locator("#code-smell a[href='#maintainability']")).toBeVisible();
  });
});
