import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")


def generate_ai_answer(question: str, feedback_items: list):
    if not api_key:
        print("OPENAI_API_KEY is missing.")
        return None

    client = OpenAI(api_key=api_key)

    feedback_text = "\n".join(
        [
            (
                f"- Sentiment: {item.sentiment or 'Unknown'} | "
                f"Theme: {item.theme or 'General'} | "
                f"Feedback: {item.content}"
            )
            for item in feedback_items[:50]
        ]
    )

    try:
        response = client.responses.create(
            model="gpt-4.1",
            instructions=(
                "You are Ask LOOP, an AI customer feedback "
                "intelligence assistant. Use only the supplied customer "
                "feedback. Do not invent facts. Identify patterns, "
                "sentiment, themes, complaints, and useful product actions. "
                "If there is not enough evidence, clearly say so. "
                "Keep the response concise and professional."
            ),
            input=(
                f"CUSTOMER FEEDBACK:\n\n{feedback_text}\n\n"
                f"USER QUESTION:\n{question}"
            )
        )

        return response.output_text

    except Exception as error:
        print("OpenAI API error:", error)
        return None