import React, { useState } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! 👋 Welcome to ShopEase. How can I help you?",
    },
  ]);

  const [showOptions, setShowOptions] = useState(true);

  const addConversation = (userText, botText) => {
    setMessages((previous) => [
      ...previous,
      {
        sender: "user",
        text: userText,
      },
      {
        sender: "bot",
        text: botText,
      },
    ]);

    setShowOptions(false);

    setTimeout(() => {
      setShowOptions(true);
    }, 300);
  };

  const handleOption = (option) => {
    if (option === "order") {
      addConversation(
        "📦 Where is my order?",
        "You can track your order from Profile → Order History → Track Order."
      );
    }

    if (option === "cancel") {
      addConversation(
        "❌ How can I cancel my order?",
        "Open Profile → Order History → View Details. If cancellation is available for your order, you can cancel it from there."
      );
    }

    if (option === "return") {
      addConversation(
        "↩️ How can I return a product?",
        "For a delivered order, open Order Tracking and select the Return option. Enter your return reason and submit the request."
      );
    }

    if (option === "delivery") {
      addConversation(
        "🚚 How long will delivery take?",
        "Delivery time depends on your location and order. You can check the latest delivery status from Track Order."
      );
    }

    if (option === "payment") {
      addConversation(
        "💰 What payment methods are available?",
        "ShopEase supports secure online payments and Cash on Delivery where available."
      );
    }

    if (option === "cart") {
      addConversation(
        "🛒 Cart / Wishlist help",
        "Use the 🛒 Cart icon to review your products. Use the ♡ Wishlist icon to view your saved favourite products."
      );
    }

    if (option === "account") {
      addConversation(
        "👤 Account help",
        "Open your Profile to manage your account, orders, addresses and account settings."
      );
    }

    if (option === "support") {
      addConversation(
        "📞 Contact support",
        "You can contact ShopEase support from the Contact section at the bottom of the website."
      );
    }
  };

  const quickOptions = [
    {
      id: "order",
      label: "📦 Where is my order?",
    },
    {
      id: "cancel",
      label: "❌ How can I cancel my order?",
    },
    {
      id: "return",
      label: "↩️ How can I return a product?",
    },
    {
      id: "delivery",
      label: "🚚 How long will delivery take?",
    },
    {
      id: "payment",
      label: "💰 Payment methods",
    },
    {
      id: "cart",
      label: "🛒 Cart / Wishlist help",
    },
    {
      id: "account",
      label: "👤 Account help",
    },
    {
      id: "support",
      label: "📞 Contact support",
    },
  ];

  const handleBackToOptions = () => {
    setShowOptions(true);
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hi! 👋 Welcome to ShopEase. How can I help you?",
      },
    ]);

    setShowOptions(true);
  };

  return (
    <>
      {/* FLOATING CHAT BUTTON */}

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

      {/* CHAT WINDOW */}

      {isOpen && (
        <div className="chatbot-window">

          {/* HEADER */}

          <div className="chatbot-header">

            <div className="chatbot-header-info">

              <div className="chatbot-avatar">
                🤖
              </div>

              <div>
                <strong>
                  ShopEase Assistant
                </strong>

                <span>
                  ● Online
                </span>
              </div>

            </div>

            <div className="chatbot-header-actions">

              <button
                type="button"
                className="chatbot-clear"
                onClick={clearChat}
                title="Clear chat"
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

          </div>

          {/* MESSAGES */}

          <div className="chatbot-messages">

            {messages.map(
              (message, index) => (
                <div
                  key={index}
                  className={
                    message.sender === "user"
                      ? "chatbot-message user-message"
                      : "chatbot-message bot-message"
                  }
                >
                  {message.text}
                </div>
              )
            )}

            {/* QUICK OPTIONS */}

            {showOptions && (
              <div className="chatbot-options">

                <p>
                  Choose an option:
                </p>

                {quickOptions.map(
                  (option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        handleOption(
                          option.id
                        )
                      }
                    >
                      {option.label}
                    </button>
                  )
                )}

              </div>
            )}

            {/* BACK TO OPTIONS */}

            {!showOptions && (
              <button
                type="button"
                className="chatbot-back-options"
                onClick={
                  handleBackToOptions
                }
              >
                ← Show options
              </button>
            )}

          </div>

          {/* INPUT */}

          <div className="chatbot-input-area">

            <span className="chatbot-input-disabled">
              Select an option above
            </span>

          </div>

        </div>
      )}
    </>
  );
}

export default Chatbot;