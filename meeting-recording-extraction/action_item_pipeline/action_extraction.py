#import openai

#openai.api_key = ""

def extract_action_items(sentences):
    prompt = "Extract action items from the following sentences:\n" + "\n".join(sentences)

    # Set your API key
    #openai.api_key = "your-openai-api-key"
    #response = openai.ChatCompletion.create(
    #model="gpt-4o-mini",  # Use "gpt-4" if needed
    #messages=[
    #    {"role": "user", "content": "What is the capital of France?"}
    #],
    #max_tokens=50,
    #temperature=0.5,
#)
    #return response.choices[0].text.strip()
