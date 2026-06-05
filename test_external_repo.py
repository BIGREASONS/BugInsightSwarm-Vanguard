import os
import sys

# Fix Windows console charmap errors for emojis/arrows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from swarm.workflow import swarm_app

print("="*60)
print("TESTING FLASK")
print("="*60)

initial_state = {
    "issue_url": None,
    "repo_url": "https://github.com/pallets/flask",
    "issue_text": "Potential insecure authentication implementation. User-controlled input may not be properly validated before authorization checks.",
    "trace_logs": []
}

try:
    print("Executing Swarm...")
    final_state = None
    for output in swarm_app.stream(initial_state):
        for node_name, state in output.items():
            print(f" -> Completed: {node_name}")
            final_state = state
            
    print("\n[PASS] Workflow completed without crashing.")
    
    print("\n--- Results ---")
    print(f"Suspected Files: {final_state.get('suspected_files')}")
    print(f"Root Cause: {final_state.get('root_cause')}")
    print("\nExploit:")
    print(final_state.get('exploit_example', 'None'))
    print("\nPatch:")
    print(final_state.get('patch', 'None')[:500] + "...")
    print("\nSprint Recommendation:")
    print(final_state.get('sprint_recommendation', 'None'))
    
except Exception as e:
    print(f"[FAIL] LangGraph workflow crashed: {e}")

print("\n" + "="*60)
print("VERIFICATION COMPLETE")
print("="*60)
