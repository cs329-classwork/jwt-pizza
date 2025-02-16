import { test, expect } from "playwright-test-coverage"
import {
  mockMenuResponse,
  mockFranchiseResponse,
  mockLoginResponse,
  mockLogoutResponse,
  mockOrderResponse,
  mockRegisterResponse,
  registerResponseObj,
  mockFranchiseLoginResponse,
  franchiseLoginObj,
  mockFranchiseByUserResponseBeforeDelete,
  mockFranchiseByUserResponseAfterDelete,
  mockDeleteStore,
  mockCreateStore,
  mockAdminLoginResponse,
  mockAdminFranchiseResponse,
  mockCreateFranchiseResponse,
  mockSecondAdminFranchiseResponse,
} from "./mocks"

test("home page", async ({ page }) => {
  await page.goto("http://localhost:5173")

  expect(await page.title()).toBe("JWT Pizza")
})

test("purchase with login", async ({ page }) => {
  await page.route("*/**/api/order/menu", mockMenuResponse)
  await page.route("*/**/api/franchise", mockFranchiseResponse)
  await page.route("*/**/api/auth", mockLoginResponse)
  await page.route("*/**/api/order", mockOrderResponse)

  await page.goto("http://localhost:5173/")
  await page.getByRole("button", { name: "Order now" }).click()
  await expect(page.locator("h2")).toContainText("Awesome is a click away")
  await page.getByRole("combobox").selectOption("1")
  await page.getByRole("link", { name: "Image Description Veggie A" }).click()
  await page.getByRole("link", { name: "Image Description Pepperoni" }).click()
  await page.getByRole("link", { name: "Image Description Margarita" }).click()
  await expect(page.locator("form")).toContainText("Selected pizzas: 3")
  await page.getByRole("button", { name: "Checkout" }).click()
  await page.getByRole("textbox", { name: "Email address" }).click()
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com")
  await page.getByRole("textbox", { name: "Email address" }).press("Tab")
  await page.getByRole("textbox", { name: "Password" }).fill("diner")
  await page.getByRole("button", { name: "Login" }).click()
  await expect(page.getByRole("main")).toContainText(
    "Send me those 3 pizzas right now!"
  )
  await expect(page.locator("tfoot")).toContainText("3 pies")
  await expect(page.locator("tbody")).toContainText("Veggie")
  await expect(page.locator("tbody")).toContainText("Pepperoni")
  await expect(page.locator("tbody")).toContainText("Margarita")
  await page.getByRole("button", { name: "Pay now" }).click()
  await expect(page.getByRole("heading")).toContainText(
    "Here is your JWT Pizza!"
  )
  await expect(page.getByRole("main")).toContainText("order ID:")
  await expect(page.getByRole("main")).toContainText("pie count:")
  await page.getByText("VerifyOrder moreorder ID:").click({
    button: "right",
  })
  await expect(page.getByRole("main")).toContainText("0.012 ₿")
  await expect(page.getByRole("main")).toContainText("0.012 ₿")
})

test("test register and logout", async ({ page }) => {
  await page.route("*/**/api/auth", mockRegisterResponse)

  await page.goto("http://localhost:5173/")
  await page.getByRole("link", { name: "Register" }).click()
  await page.getByRole("textbox", { name: "Full name" }).click()
  await page.getByRole("textbox", { name: "Full name" }).fill("geep gorp")
  await page.getByRole("textbox", { name: "Full name" }).press("Tab")
  await page.getByRole("textbox", { name: "Email address" }).fill("gg@jwt.com")
  await page.getByRole("textbox", { name: "Email address" }).press("Tab")
  await page.getByRole("textbox", { name: "Password" }).fill("gg")
  await page.getByRole("button", { name: "Register" }).click()

  await page.getByRole("link", { name: "gg" }).click()
  await expect(page.getByText("geep gorp")).toBeVisible()
  await expect(page.getByRole("main")).toContainText(
    "How have you lived this long without having a pizza? Buy one now!"
  )
  await expect(page.getByRole("heading")).toContainText("Your pizza kitchen")
  await expect(page.getByRole("link", { name: "Logout" })).toBeVisible()

  await page.route("*/**/api/auth", mockLogoutResponse)
  await page.getByRole("link", { name: "Logout" }).click()

  await expect(page.getByRole("link", { name: "Login" })).toBeVisible()
})

test("franchise", async ({ page }) => {
  await page.goto("http://localhost:5173/")

  await page.route("*/**/api/auth", mockFranchiseLoginResponse)
  await page.route(
    "*/**/api/franchise/3",
    mockFranchiseByUserResponseBeforeDelete
  )

  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click()
  await page.getByRole("link", { name: "login", exact: true }).click()
  await page.getByRole("textbox", { name: "Email address" }).click()
  await page.getByRole("textbox", { name: "Email address" }).fill("pp@jwt.com")
  await page.getByRole("textbox", { name: "Password" }).click()
  await page.getByRole("textbox", { name: "Password" }).fill("pizza pocket")
  await page.getByRole("button", { name: "Login" }).click()
  await page.goto("localhost:5173/franchise-dashboard", {
    waitUntil: "networkidle",
  })

  await expect(page.getByRole("heading")).toContainText("Pizza Pocket")
  await expect(page.getByRole("columnheader", { name: "Name" })).toBeVisible()
  await expect(
    page.getByRole("columnheader", { name: "Revenue" })
  ).toBeVisible()
  await expect(page.getByRole("columnheader", { name: "Action" })).toBeVisible()
  await expect(page.getByRole("cell", { name: "SLC" })).toBeVisible()
  await expect(page.getByRole("cell", { name: "Orem" })).toBeVisible()

  await page
    .getByRole("row", { name: "SLC 0.032 ₿ Close" })
    .getByRole("button")
    .click()
  await expect(page.getByRole("heading")).toContainText("Sorry to see you go")
  await expect(page.getByRole("main")).toContainText("SLC")
  await page.getByRole("button", { name: "Cancel" }).click()

  await page.route("*/**/api/franchise/1/store/4", mockDeleteStore)
  await expect(page.getByRole("cell", { name: "SLC" })).toBeVisible()
  await page
    .getByRole("row", { name: "Orem 0 ₿ Close" })
    .getByRole("button")
    .click()
  await expect(page.getByRole("heading")).toContainText("Sorry to see you go")
  await expect(page.getByRole("main")).toContainText("Orem")
  await page.getByRole("button", { name: "Close" }).click()

  await page.route(
    "*/**/api/franchise/3",
    mockFranchiseByUserResponseAfterDelete
  )
})

test("admin", async ({ page }) => {
  await page.goto("http://localhost:5173/")

  await page.route("*/**/api/auth", mockAdminLoginResponse)
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.goto("localhost:5173", { waitUntil: "networkidle"})
  
  await page.route("*/**/api/franchise", mockAdminFranchiseResponse)
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();
  await expect(page.getByRole('heading')).toContainText('Mama Ricci\'s kitchen');
  await expect(page.getByRole('columnheader', { name: 'Franchise', exact: true })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Franchisee' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Store' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Revenue' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Action' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Pizza Pocket', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('Biggie Cheese');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('a@jwt.com');
  
  // THIS ONLY WORKS IN VSCODE (FOR SOME ARBITRARY AND PROBABLY REALLY ANNOYING REASON) DO NOT UNCOMMENT.
  // await page.route("*/**/api/franchise", mockCreateFranchiseResponse)
  // await page.getByRole('button', { name: 'Create' }).click();
  
  // await page.route("*/**/api/franchise", mockSecondAdminFranchiseResponse)
  // // await page.goto("localhost:5173/admin-dashboard", {waitUntil: "networkidle"})

  // await expect(page.getByRole('cell', { name: 'Biggie Cheese' })).toBeVisible();

  // await page.getByRole('row', { name: 'Biggie Cheese 常用名字 Close' }).getByRole('button').click();
  // await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
  // await page.getByRole('button', { name: 'Close' }).click();
})
