import { test, expect } from "@playwright/test";

test.describe("결제 페이지 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("🔍 시나리오 1: 정상 결제 플로우 테스트", async ({ page }) => {
    // 1. 페이지 로드 및 UI 검증
    await expect(page.getByRole("heading", { name: "💳 결제 페이지" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "카드 번호" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "카드 소유자" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "만료일" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "CVV" })).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "결제 금액" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "결제 내역" })).toBeVisible();
    await expect(page.getByRole("button", { name: "결제하기" })).toBeVisible();

    // 2. 카드 정보 입력 테스트
    await page.getByRole("textbox", { name: "카드 번호" }).fill("1234567890123456");
    await expect(page.getByRole("textbox", { name: "카드 번호" })).toHaveValue("1234 5678 9012 3456");

    await page.getByRole("textbox", { name: "카드 소유자" }).fill("홍길동");
    await page.getByRole("textbox", { name: "만료일" }).fill("12/25");
    await page.getByRole("textbox", { name: "CVV" }).fill("123");
    await page.getByRole("spinbutton", { name: "결제 금액" }).fill("50000");
    await page.getByRole("textbox", { name: "결제 내역" }).fill("온라인 쇼핑몰 결제");

    // 3. 결제 처리 테스트
    await page.getByRole("button", { name: "결제하기" }).click();

    // 결제 처리 중 메시지 확인
    await expect(page.getByText("결제 처리 중...")).toBeVisible();

    // 2초 후 성공 메시지 확인
    await expect(page.getByText("✅ 결제가 성공적으로 완료되었습니다!")).toBeVisible({ timeout: 5000 });

    // 성공 후 모든 입력 필드가 초기화되는지 확인
    await expect(page.getByRole("textbox", { name: "카드 번호" })).toHaveValue("");
    await expect(page.getByRole("textbox", { name: "카드 소유자" })).toHaveValue("");
    await expect(page.getByRole("textbox", { name: "만료일" })).toHaveValue("");
    await expect(page.getByRole("textbox", { name: "CVV" })).toHaveValue("");
    await expect(page.getByRole("spinbutton", { name: "결제 금액" })).toHaveValue("");
    await expect(page.getByRole("textbox", { name: "결제 내역" })).toHaveValue("");
  });

  test("❌ 시나리오 2: 폼 검증 테스트", async ({ page }) => {
    // 1. 필수 필드 검증
    await page.getByRole("button", { name: "결제하기" }).click();

    page.on("dialog", (dialog) => {
      expect(dialog.message()).toBe("모든 필드를 입력해주세요.");
      dialog.accept();
    });

    // 2. 카드 번호 형식 검증 (15자리)
    await page.getByRole("textbox", { name: "카드 번호" }).fill("123456789012345");
    await page.getByRole("textbox", { name: "카드 소유자" }).fill("홍길동");
    await page.getByRole("textbox", { name: "만료일" }).fill("12/25");
    await page.getByRole("textbox", { name: "CVV" }).fill("123");
    await page.getByRole("spinbutton", { name: "결제 금액" }).fill("50000");
    await page.getByRole("textbox", { name: "결제 내역" }).fill("테스트");

    page.on("dialog", (dialog) => {
      expect(dialog.message()).toBe("올바른 카드 번호를 입력해주세요.");
      dialog.accept();
    });
    await page.getByRole("button", { name: "결제하기" }).click();

    // 3. CVV 형식 검증 (2자리)
    await page.getByRole("textbox", { name: "카드 번호" }).fill("1234567890123456");
    await page.getByRole("textbox", { name: "CVV" }).fill("12");

    page.on("dialog", (dialog) => {
      expect(dialog.message()).toBe("올바른 CVV를 입력해주세요.");
      dialog.accept();
    });
    await page.getByRole("button", { name: "결제하기" }).click();

    // 4. 결제 금액 검증 (0)
    await page.getByRole("textbox", { name: "CVV" }).fill("123");
    await page.getByRole("spinbutton", { name: "결제 금액" }).fill("0");

    page.on("dialog", (dialog) => {
      expect(dialog.message()).toBe("올바른 금액을 입력해주세요.");
      dialog.accept();
    });
    await page.getByRole("button", { name: "결제하기" }).click();
  });

  test("🔒 시나리오 3: 입력 형식 및 특수 문자 테스트", async ({ page }) => {
    // 1. 카드 번호 자동 필터링
    await page.getByRole("textbox", { name: "카드 번호" }).fill("1234abcd5678efgh");
    await expect(page.getByRole("textbox", { name: "카드 번호" })).toHaveValue("1234 5678");

    // 2. CVV 자동 필터링
    await page.getByRole("textbox", { name: "CVV" }).fill("12a");
    await expect(page.getByRole("textbox", { name: "CVV" })).toHaveValue("12");

    // 3. 특수 문자 입력 테스트
    await page.getByRole("textbox", { name: "카드 소유자" }).fill("홍길동@#$%");
    await expect(page.getByRole("textbox", { name: "카드 소유자" })).toHaveValue("홍길동@#$%");

    await page.getByRole("textbox", { name: "결제 내역" }).fill("<script>alert('test')</script>");
    await expect(page.getByRole("textbox", { name: "결제 내역" })).toHaveValue("<script>alert('test')</script>");
  });

  test("📱 시나리오 4: 반응형 디자인 테스트", async ({ page }) => {
    // 1. 데스크톱 뷰 (1920x1080)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole("heading", { name: "💳 결제 페이지" })).toBeVisible();

    // 2. 태블릿 뷰 (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole("heading", { name: "💳 결제 페이지" })).toBeVisible();

    // 3. 모바일 뷰 (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole("heading", { name: "💳 결제 페이지" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "카드 번호" })).toBeVisible();
  });

  test("💳 시나리오 5: 결제 처리 상태 테스트", async ({ page }) => {
    // 모든 필드를 올바르게 입력
    await page.getByRole("textbox", { name: "카드 번호" }).fill("1234567890123456");
    await page.getByRole("textbox", { name: "카드 소유자" }).fill("홍길동");
    await page.getByRole("textbox", { name: "만료일" }).fill("12/25");
    await page.getByRole("textbox", { name: "CVV" }).fill("123");
    await page.getByRole("spinbutton", { name: "결제 금액" }).fill("50000");
    await page.getByRole("textbox", { name: "결제 내역" }).fill("테스트");

    // 결제하기 버튼 클릭
    await page.getByRole("button", { name: "결제하기" }).click();

    // 결제 처리 중 메시지 확인
    await expect(page.getByText("결제 처리 중...")).toBeVisible();

    // 모든 입력 필드가 비활성화되는지 확인
    await expect(page.getByRole("textbox", { name: "카드 번호" })).toBeDisabled();
    await expect(page.getByRole("textbox", { name: "카드 소유자" })).toBeDisabled();
    await expect(page.getByRole("textbox", { name: "만료일" })).toBeDisabled();
    await expect(page.getByRole("textbox", { name: "CVV" })).toBeDisabled();
    await expect(page.getByRole("spinbutton", { name: "결제 금액" })).toBeDisabled();
    await expect(page.getByRole("textbox", { name: "결제 내역" })).toBeDisabled();

    // 2초 후 성공 메시지 확인
    await expect(page.getByText("✅ 결제가 성공적으로 완료되었습니다!")).toBeVisible({ timeout: 5000 });
  });
});
