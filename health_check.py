import os
import requests
import sys
from pathlib import Path

def print_status(name, status, details=""):
    if status:
        print(f"[PASS] {name:<20} {details}")
    else:
        print(f"[FAIL] {name:<20} {details}")
        
def check_ollama():
    try:
        res = requests.get("http://localhost:11434/api/tags", timeout=3)
        if res.status_code == 200:
            models = [m["name"] for m in res.json().get("models", [])]
            required = ["qwen2.5-coder:7b", "llama3.1:8b"]
            missing = [req for req in required if not any(m.startswith(req) for m in models)]
            if missing:
                print_status("Ollama Running", False, f"Missing models: {missing}")
                return False
            print_status("Ollama Running", True, "Required models found.")
            return True
        else:
            print_status("Ollama Running", False, f"Status Code: {res.status_code}")
            return False
    except Exception as e:
        print_status("Ollama Running", False, f"Error connecting to Ollama: {e}")
        return False

def check_codebert():
    try:
        res = requests.post("http://localhost:8000/predict_severity", json={"issue_text": "test"}, timeout=3)
        if res.status_code == 200:
            print_status("CodeBERT Running", True, "API is responding.")
            return True
        else:
            print_status("CodeBERT Running", False, f"Status Code: {res.status_code}")
            return False
    except Exception as e:
        print_status("CodeBERT Running", False, f"Error connecting to CodeBERT API: {e}")
        return False

def check_chroma():
    chroma_path = Path(__file__).parent / "outputs" / "chroma_db"
    if chroma_path.exists() and chroma_path.is_dir():
        try:
            import chromadb
            client = chromadb.PersistentClient(path=str(chroma_path))
            collections = [c.name for c in client.list_collections()]
            if "buginsight_demo_repo" in collections:
                print_status("Chroma Loaded", True, "Database and collection found.")
                return True
            else:
                print_status("Chroma Loaded", False, "buginsight_demo_repo collection missing.")
                return False
        except Exception as e:
            print_status("Chroma Loaded", False, f"Error loading Chroma: {e}")
            return False
    else:
        print_status("Chroma Loaded", False, "Database directory not found.")
        return False

def check_langgraph():
    try:
        from swarm.workflow import swarm_app
        if swarm_app:
            print_status("LangGraph Loaded", True, "Workflow compiled successfully.")
            return True
        else:
            print_status("LangGraph Loaded", False, "Workflow not found.")
            return False
    except ImportError as e:
        print_status("LangGraph Loaded", False, f"Import error: {e}")
        return False

def check_github():
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        print_status("GitHub Configured", True, "GITHUB_TOKEN is set.")
        return True
    else:
        print_status("GitHub Configured", False, "GITHUB_TOKEN is missing (Mock mode will be used).")
        # Returning True because Mock mode is acceptable for demo, but we show the warning
        return True

if __name__ == "__main__":
    print("="*60)
    print("BUGINSIGHT SWARM: HEALTH CHECK")
    print("="*60)
    
    ollama_ok = check_ollama()
    codebert_ok = check_codebert()
    chroma_ok = check_chroma()
    langgraph_ok = check_langgraph()
    github_ok = check_github()
    
    print("="*60)
    if ollama_ok and codebert_ok and chroma_ok and langgraph_ok and github_ok:
        print("ALL SYSTEMS GO. Ready for Demo.")
        sys.exit(0)
    else:
        print("SYSTEM WARNING: One or more components failed the health check.")
        sys.exit(1)
