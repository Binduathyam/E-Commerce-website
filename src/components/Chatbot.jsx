
import React, { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../api";
import "./Chatbot.css";

const WELCOME_MESSAGE = {
  sender: "bot",
  text: "Hi! 👋 Welcome to ShopEase! Ask me about products, prices, discounts, comparisons, or recommendations.",
  products: [],
  videos: [],
};

const QUICK_OPTIONS = [
  {
    id: "order",
    label: "📦 Where is my order?",
    answer:
      "You can track your order from Profile → Order History → Track Order.",
  },
  {
    id: "cancel",
    label: "❌ How can I cancel my order?",
    answer:
      "Open Profile → Order History → View Details. If cancellation is available, you can cancel it there.",
  },
  {
    id: "return",
    label: "↩️ How can I return a product?",
    answer:
      "Open Order Tracking and select Return for an eligible delivered order.",
  },
  {
    id: "delivery",
    label: "🚚 Delivery time",
    answer:
      "Delivery time depends on your location and order. Check Track Order for the latest status.",
  },
  {
    id: "payment",
    label: "💰 Payment methods",
    answer:
      "Available payment methods are shown during checkout. Cash on Delivery may be available for eligible orders.",
  },
  {
    id: "cart",
    label: "🛒 Cart / Wishlist help",
    answer:
      "Use the Cart icon to review your cart and the Wishlist icon to see saved products.",
  },
  {
    id: "account",
    label: "👤 Account help",
    answer:
      "Open your Profile to manage your account, addresses, and orders.",
  },
  {
    id: "support",
    label: "📞 Contact support",
    answer:
      "Please visit the Contact section at the bottom of the ShopEase website.",
  },
];

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState([WELCOME_MESSAGE]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const addLocalConversation = (option) => {
    setMessages((previous) => [
      ...previous,
      {
        sender: "user",
        text: option.label,
      },
      {
        sender: "bot",
        text: option.answer,
        products: [],
        videos: [],
      },
    ]);

    setError("");
  };

  const sendMessage = async (text = input) => {
    const question = text.trim();

    if (!question || loading) return;

    setInput("");
    setError("");
    setLoading(true);

    setMessages((previous) => [
      ...previous,
      {
        sender: "user",
        text: question,
      },
    ]);

    try {
      const baseUrl = API_BASE_URL.replace(/\/+$/, "");

      const response = await fetch(
        `${baseUrl}/api/chatbot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: question,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to get an answer."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          sender: "bot",
          text: data.answer || "I couldn't find an answer.",
          products: Array.isArray(data.products)
            ? data.products
            : [],
          videos: Array.isArray(data.videos)
            ? data.videos
            : [],
        },
      ]);
    } catch (err) {
      console.error("ShopEase chatbot error:", err);

      setError(
        "Couldn't connect to the assistant. Please try again."
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    if (loading) return;

    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setError("");
  };

  const getProductPrice = (product) => {
    const price = Number(product.price);

    if (!Number.isFinite(price)) {
      return "Price unavailable";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getProductImage = (image) => {
    if (!image || typeof image !== "string") {
      return "";
    }

    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    const baseUrl = API_BASE_URL.replace(/\/+$/, "");
    return `${baseUrl}/${image.replace(/^\/+/, "")}`;
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          className="chatbot-floating-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open ShopEase Assistant"
        >
          💬
        </button>
      )}

      {isOpen && (
        <section
          className="chatbot-window"
          aria-label="ShopEase AI Assistant"
        >
          <header className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>

              <div>
                <strong>ShopEase Assistant</strong>
                <span>
                  <span className="chatbot-online-dot" />
                  Shopping help
                </span>
              </div>
            </div>

            <div className="chatbot-header-actions">
              <button
                type="button"
                className="chatbot-clear"
                onClick={clearChat}
                disabled={loading}
                title="Clear chat"
                aria-label="Clear chat"
              >
                ↻
              </button>

              <button
                type="button"
                className="chatbot-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
              >
                ×
              </button>
            </div>
          </header>

          <div
            className="chatbot-messages"
            aria-live="polite"
          >
            <div className="chatbot-date-label">
              Your ShopEase assistant
            </div>

            {messages.map((message, index) => (
              <div
                key={`${index}-${message.sender}`}
                className={
                  message.sender === "user"
                    ? "chatbot-message-group user-group"
                    : "chatbot-message-group bot-group"
                }
              >
                <div
                  className={
                    message.sender === "user"
                      ? "chatbot-message user-message"
                      : "chatbot-message bot-message"
                  }
                >
                  {message.text}
                </div>

                {message.sender === "bot" &&
                  message.products?.length > 0 && (
                    <div className="chatbot-product-results">
                      <strong className="chatbot-section-title">
                        Products for you
                      </strong>

                      {message.products.map((product) => (
                        <article
                          className="chatbot-product-card"
                          key={product.id}
                        >
                          {product.image && (
                            <img
                              className="chatbot-product-image"
                              src={getProductImage(product.image)}
                              alt={product.name || "Product"}
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          )}

                          <div className="chatbot-product-info">
                            <strong>
                              {product.name}
                            </strong>

                            {product.brand && (
                              <span>
                                Brand: {product.brand}
                              </span>
                            )}

                            {product.category && (
                              <span>
                                Category: {product.category}
                              </span>
                            )}

                            <strong className="chatbot-product-price">
                              {getProductPrice(product)}
                            </strong>

                            {product.discount != null &&
                              Number(product.discount) > 0 && (
                                <span>
                                  {product.discount}% discount
                                </span>
                              )}

                            {product.description && (
                              <p>
                                {product.description.length > 140
                                  ? `${product.description.slice(0, 140)}...`
                                  : product.description}
                              </p>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}

                {message.sender === "bot" &&
                  message.videos?.length > 0 && (
                    <div className="chatbot-video-results">
                      <strong className="chatbot-section-title">
                        ▶ Related YouTube videos
                      </strong>

                      {message.videos.map((video, videoIndex) => (
                        <a
                          key={`${videoIndex}-${video.url}`}
                          className="chatbot-video-link"
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="chatbot-video-icon">
                            ▶
                          </span>

                          <span>{video.title}</span>

                          <span aria-hidden="true">↗</span>
                        </a>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {messages.length === 1 && (
              <div className="chatbot-options">
                <p>How can I help you today?</p>

                <div className="chatbot-suggestions">
                  {[
                    "Show products",
                    "Products under ₹30000",
                    "Find product videos",
                  ].map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      disabled={loading}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                <p className="chatbot-help-heading">
                  Other help
                </p>

                {QUICK_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => addLocalConversation(option)}
                    disabled={loading}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div
                className="chatbot-message bot-message chatbot-typing"
                role="status"
              >
                <span />
                <span />
                <span />
                <small>Finding an answer...</small>
              </div>
            )}

            {error && (
              <div className="chatbot-error" role="alert">
                <span>{error}</span>

                <button
                  type="button"
                  onClick={() => sendMessage(
                    messages[messages.length - 1]?.text || ""
                  )}
                  disabled={loading}
                >
                  Retry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            className="chatbot-input-area"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about products, prices..."
              aria-label="Ask ShopEase Assistant"
              maxLength={1000}
              disabled={loading}
            />

            <button
              type="submit"
              className="chatbot-send-button"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              {loading ? "…" : "➤"}
            </button>
          </form>

          <div className="chatbot-footer-note">
            ShopEase Assistant · Check product details before purchase
          </div>
        </section>
      )}
    </>
  );
}

export default Chatbot;
