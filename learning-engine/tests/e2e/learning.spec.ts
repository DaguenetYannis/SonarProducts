import { test, expect } from "@playwright/test";

test.describe("local scaffold", () => {
  test("shows the empty application state", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Learning Engine" })).toBeVisible();
    await expect(page.getByText("No levels available")).toBeVisible();
  });
});
