import base64
import os
from google.genai import types
from google.generativeai import GenerativeModel
import google.generativeai as genai
from dotenv import load_dotenv
from pydantic import BaseModel
import json

load_dotenv()


class suggestion(BaseModel):
    response: str
    suggestions: list[str]

api_key= os.getenv('GEMINI_API_KEY')
genai.configure(api_key=api_key)


generation_config={
    'temperature':0.85,
    'response_mime_type': "text/plain",
    'response_mime_type': "application/json",
    'response_schema': suggestion,
}

model= genai.GenerativeModel(
    model_name="gemini-2.5-flash-preview-05-20",
    generation_config=generation_config
    )





def generate_prompt(prompt):
    try:
        input= model.generate_content([

            f'query: {prompt}',
            'output: '
        ]   
        )
        input= json.loads(input.text)
        responses= input['response']
        suggestions= input['suggestions']
        return responses, suggestions


    except Exception as e:
        print(f'error is : {e}')

    
    
 






if __name__ == "__main__":
    while True:
        prompt= input('YOU: ')
        if prompt.lower() in ['bye','exit', 'close', 'quit']:
            print('Goodbye')
            break
        response, suggestions= generate_prompt(prompt)

        print(f'BOT response is: {response}')
        print(f'BOT suggestion is: {suggestions}')
