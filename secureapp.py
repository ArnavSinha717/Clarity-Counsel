from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import google.generativeai as genai
from google.oauth2 import service_account
from googleapiclient.discovery import build
import os
import re
import logging
from concurrent.futures import ThreadPoolExecutor
from functools import reduce
from typing import List, Dict
import time

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Google Docs and Drive API setup
SCOPES = [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive'
]
SERVICE_ACCOUNT_FILE = 'C:\\users\\arnav\\Python\\service_account.json'

try:
    logger.info("Loading service account credentials...")
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        raise FileNotFoundError(f"Service account file not found at: {SERVICE_ACCOUNT_FILE}")
    credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    docs_service = build('docs', 'v1', credentials=credentials)
    drive_service = build('drive', 'v3', credentials=credentials)
    logger.info("Service account credentials loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load service account credentials: {str(e)}")
    raise

# Gemini API setup
# GEMINI_API_KEY = "YOUR_API_KEY" # Removed API key
genai.configure(api_key=os.environ.get('GEMINI_API_KEY')) # Use environment variable
try:
    model = genai.GenerativeModel('gemini-1.5-pro')
    logger.info("Gemini model initialized successfully.")
except Exception as e:
    logger.error(f"Failed to initialize Gemini model: {str(e)}")
    raise

def make_document_public(doc_id: str) -> None:
    try:
        permission = {'type': 'anyone', 'role': 'reader'}
        drive_service.permissions().create(fileId=doc_id, body=permission).execute()
        logger.info(f"Document {doc_id} set to public access.")
    except Exception as e:
        logger.error(f"Failed to set public access for document {doc_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error setting document permissions: {str(e)}")

def extract_text_from_pdf(file: UploadFile) -> str:
    try:
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = ""
        total_pages = len(pdf_reader.pages)
        for i, page in enumerate(pdf_reader.pages, 1):
            extracted = page.extract_text()
            if extracted:
                text += extracted
            logger.info(f"Extracted text from page {i}/{total_pages}. Progress: {int((i/total_pages)*20 + 10)}%")
        if not text:
            raise HTTPException(status_code=400, detail="No text could be extracted from the PDF.")
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

def extract_text_from_txt(file: UploadFile) -> str:
    try:
        return file.file.read().decode('utf-8')
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading TXT: {str(e)}")

def analyze_issues_with_gemini(text: str) -> Dict[str, str | List[str]]:
    try:
        prompt = (
            "You are an expert AI legal consultant. Review this legal document and perform the following:\n"
            "1. **Summary**: Provide a concise summary of the document's purpose and key points in 2-3 sentences.\n"
            "2. **Issues**: Identify any ambiguous, biased, or unclear clauses. List them under 'Issues:'.\n"
            "Use this exact structure for your response:\n"
            "Summary:\n[Your summary here]\n\nIssues:\n- [Issue 1]\n- [Issue 2]\n"
            "Text to analyze:\n\n" + text
        )
        response = model.generate_content(prompt)
        if not response.text:
            raise HTTPException(status_code=500, detail="Empty response from Gemini in issues analysis.")
        
        response_text = re.sub(r'\n+', '\n', response.text).strip()
        lines = response_text.split('\n')
        
        summary = ""
        issues = []
        current_section = None
        
        for line in lines:
            line = line.strip()
            if line.lower().startswith('summary:'):
                current_section = 'summary'
            elif line.lower().startswith('issues:'):
                current_section = 'issues'
            elif line and current_section == 'summary' and not summary:
                summary = line
            elif line and current_section == 'issues':
                issues.append(line.lstrip('- ').strip())
        
        if not summary and not issues:
            logger.warning("No summary or issues identified by Gemini.")
        
        return {'summary': summary, 'issues': issues}
    except Exception as e:
        logger.error(f"Gemini issues analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gemini issues analysis error: {str(e)}")

def generate_modified_chunk(chunk_data: tuple[str, List[str], int, int]) -> tuple[int, str]:
    chunk_text, issues, chunk_index, total_chunks = chunk_data
    try:
        issues_text = "\n".join([f"- {issue}" for issue in issues])
        prompt = (
            "Revise this legal text chunk to address the listed issues with clarity, fairness, and precision:\n"
            "Issues:\n" + issues_text + "\n\nText:\n" + chunk_text
        )
        start_time = time.time()
        response = model.generate_content(prompt)
        elapsed = time.time() - start_time
        logger.info(f"Modified chunk {chunk_index + 1}/{total_chunks} in {elapsed:.2f}s")
        if not response.text:
            logger.warning(f"Empty response for chunk {chunk_index + 1}/{total_chunks}")
            return (chunk_index, chunk_text)
        return (chunk_index, response.text.strip())
    except Exception as e:
        logger.error(f"Error modifying chunk {chunk_index + 1}/{total_chunks}: {str(e)}")
        return (chunk_index, chunk_text)

def generate_modified_text_with_gemini(original_text: str, issues: List[str]) -> str:
    try:
        if not issues:
            logger.info("No issues provided; returning original text.")
            return original_text
        
        start_time = time.time()
        
        if len(original_text) < 2000:
            issues_text = "\n".join([f"- {issue}" for issue in issues])
            prompt = (
                "Revise this legal text to address the listed issues with clarity, fairness, and precision:\n"
                "Issues:\n" + issues_text + "\n\nText:\n" + original_text
            )
            response = model.generate_content(prompt)
            elapsed = time.time() - start_time
            logger.info(f"Single-call modification took {elapsed:.2f}s")
            if not response.text:
                logger.warning("Empty response from Gemini for single-call")
                return original_text
            return response.text.strip()
        
        chunks = [chunk.strip() for chunk in original_text.split('\n\n') if chunk.strip()]
        if not chunks:
            chunks = [original_text]
        
        total_chunks = len(chunks)
        with ThreadPoolExecutor(max_workers=min(4, total_chunks)) as executor:
            chunk_results = list(executor.map(
                lambda i_chunk: generate_modified_chunk((i_chunk[1], issues, i_chunk[0], total_chunks)),
                enumerate(chunks)
            ))
        
        sorted_results = sorted(chunk_results, key=lambda x: x[0])
        modified_text = "\n\n".join(result[1] for result in sorted_results)
        
        elapsed = time.time() - start_time
        logger.info(f"Chunked modification took {elapsed:.2f}s for {total_chunks} chunks")
        
        if not modified_text:
            logger.warning("No modified text generated; returning original.")
            return original_text
        
        return modified_text
    except Exception as e:
        logger.error(f"Gemini text modification error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gemini text modification error: {str(e)}")

def create_issues_doc(issues: List[str]) -> str:
    try:
        doc = docs_service.documents().create(body={"title": "Legal Document Issues"}).execute()
        doc_id = doc['documentId']
        
        requests = [
            {
                'insertText': {
                    'location': {'index': 1},
                    'text': "Ambiguous or Biased Clauses\n\n"
                }
            },
            {
                'updateTextStyle': {
                    'range': {
                        'startIndex': 1,
                        'endIndex': len("Ambiguous or Biased Clauses") + 1
                    },
                    'textStyle': {
                        'bold': True,
                        'fontSize': {'magnitude': 14, 'unit': 'PT'}
                    },
                    'fields': 'bold,fontSize'
                }
            }
        ]
        
        current_index = len("Ambiguous or Biased Clauses\n\n") + 1
        for i, issue in enumerate(issues, 1):
            bullet_text = f"• {issue}\n"
            requests.extend([
                {
                    'insertText': {
                        'location': {'index': current_index},
                        'text': bullet_text
                    }
                },
                {
                    'createParagraphBullets': {
                        'range': {
                            'startIndex': current_index,
                            'endIndex': current_index + len(bullet_text)
                        },
                        'bulletPreset': 'BULLET_DISC_CIRCLE_SQUARE'
                    }
                }
            ])
            current_index += len(bullet_text)
            logger.info(f"Added issue {i}/{len(issues)} to issues document. Progress: {int(85 + (i/len(issues))*7)}%")
        
        requests.append({
            'insertText': {
                'location': {'index': current_index},
                'text': "\n"
            }
        })
        
        docs_service.documents().batchUpdate(documentId=doc_id, body={'requests': requests}).execute()
        make_document_public(doc_id)
        return f"https://docs.google.com/document/d/{doc_id}/edit"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating issues document: {str(e)}")

def create_modified_doc(original_text: str, modified_text: str) -> str:
    """Create a document with the modified text, no highlighting."""
    try:
        doc = docs_service.documents().create(body={"title": "Modified Legal Document"}).execute()
        doc_id = doc['documentId']
        
        requests = [
            {
                'insertText': {
                    'location': {'index': 1},
                    'text': modified_text + "\n"
                }
            }
        ]
        
        docs_service.documents().batchUpdate(documentId=doc_id, body={'requests': requests}).execute()
        make_document_public(doc_id)
        logger.info("Modified document created.")
        return f"https://docs.google.com/document/d/{doc_id}/edit"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating modified document: {str(e)}")

@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):
    try:
        logger.info("Starting document analysis... Progress: 0%")
        logger.info("Extracting text from file... Progress: 10%")
        if file.content_type == "application/pdf":
            text = extract_text_from_pdf(file)
        elif file.content_type == "text/plain":
            text = extract_text_from_txt(file)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF or TXT.")
        logger.info("Text extraction complete. Progress: 30%")

        logger.info("Analyzing issues with Gemini API... Progress: 40%")
        analysis = analyze_issues_with_gemini(text)
        logger.info("Issues analysis complete. Progress: 60%")

        logger.info("Generating modified text with Gemini API... Progress: 70%")
        modified_text = generate_modified_text_with_gemini(text, analysis['issues'])
        logger.info("Modified text generation complete. Progress: 80%")

        logger.info("Creating issues document... Progress: 85%")
        issues_doc_url = create_issues_doc(analysis['issues'])
        logger.info("Issues document created. Progress: 92%")

        logger.info("Creating modified document... Progress: 95%")
        modified_doc_url = create_modified_doc(text, modified_text)
        logger.info("Modified document created. Progress: 100%")

        logger.info("Document analysis complete!")
        return {
            "summary": analysis.get('summary', ''),
            "issuesDocUrl": issues_doc_url,
            "modifiedDocUrl": modified_doc_url
        }
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)