import { test, expect } from "@playwright/test";

test.describe("learning app shell", () => {
  test("shows imported Sonar learning levels", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Sonar Products" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Product and Vocabulary Foundations" })).toBeVisible();
    await expect(page.getByText("18 questions").first()).toBeVisible();
  });

  test("exposes installable app metadata", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.webmanifest");
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#090b10");
  });
});
