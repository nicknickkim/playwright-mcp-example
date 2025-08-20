import React, { useState } from "react";
import "./PaymentPage.css";

interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  amount: string;
  description: string;
}

const PaymentPage: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    amount: "",
    description: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCVV = (value: string) => {
    // 숫자만 추출하고 최대 3자리까지만 허용
    return value.replace(/[^0-9]/g, "").slice(0, 3);
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCVV(e.target.value);
    setFormData((prev) => ({
      ...prev,
      cvv: formatted,
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      cardNumber: formatted,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate || !formData.cvv || !formData.amount || !formData.description) {
      alert("모든 필드를 입력해주세요.");
      return false;
    }

    if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
      alert("올바른 카드 번호를 입력해주세요.");
      return false;
    }

    if (formData.cvv.length !== 3) {
      alert("올바른 CVV를 입력해주세요.");
      return false;
    }

    if (parseFloat(formData.amount) <= 0) {
      alert("올바른 금액을 입력해주세요.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("idle");

    try {
      // 실제 결제 API 호출을 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 성공 시뮬레이션 (90% 성공률)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        setPaymentStatus("success");
        // 폼 초기화
        setFormData({
          cardNumber: "",
          cardHolder: "",
          expiryDate: "",
          cvv: "",
          amount: "",
          description: "",
        });
      } else {
        setPaymentStatus("error");
      }
    } catch (error) {
      setPaymentStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>💳 결제 페이지</h1>
        <p className="subtitle">안전하고 빠른 결제를 진행해주세요</p>

        {paymentStatus === "success" && <div className="success-message">✅ 결제가 성공적으로 완료되었습니다!</div>}

        {paymentStatus === "error" && <div className="error-message">❌ 결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.</div>}

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="cardNumber">카드 번호</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              disabled={isProcessing}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cardHolder">카드 소유자</label>
              <input
                type="text"
                id="cardHolder"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleInputChange}
                placeholder="홍길동"
                disabled={isProcessing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="expiryDate">만료일</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                maxLength={5}
                disabled={isProcessing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleCVVChange}
                placeholder="123"
                maxLength={3}
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="amount">결제 금액</label>
            <div className="amount-input">
              <span className="currency">₩</span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="1000"
                disabled={isProcessing}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">결제 내역</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="결제 내역을 입력해주세요"
              rows={3}
              disabled={isProcessing}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isProcessing}>
            {isProcessing ? "결제 처리 중..." : "결제하기"}
          </button>
        </form>

        <div className="security-info">
          <p>🔒 모든 결제 정보는 SSL 암호화로 안전하게 보호됩니다.</p>
          <p>💳 주요 신용카드 및 체크카드 결제를 지원합니다.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
