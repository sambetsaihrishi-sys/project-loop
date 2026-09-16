def analyze_feedback(text: str):
    text_lower = text.lower()

    positive_words = [
        "good", "great", "excellent", "amazing",
        "love", "helpful", "fast", "easy", "happy"
    ]

    negative_words = [
        "bad", "slow", "poor", "terrible",
        "problem", "issue", "error", "hate",
        "difficult", "broken", "crash"
    ]

    positive_score = sum(
        word in text_lower for word in positive_words
    )

    negative_score = sum(
        word in text_lower for word in negative_words
    )

    if positive_score > negative_score:
        sentiment = "Positive"
    elif negative_score > positive_score:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    if any(word in text_lower for word in ["slow", "crash", "performance", "loading"]):
        theme = "Product Performance"

    elif any(word in text_lower for word in ["payment", "price", "billing", "refund"]):
        theme = "Billing & Payments"

    elif any(word in text_lower for word in ["login", "password", "account", "sign in"]):
        theme = "Authentication"

    elif any(word in text_lower for word in ["support", "agent", "response", "help"]):
        theme = "Customer Support"

    elif any(word in text_lower for word in ["feature", "design", "interface", "ui"]):
        theme = "Product Experience"

    else:
        theme = "General"

    return {
        "sentiment": sentiment,
        "theme": theme
    }