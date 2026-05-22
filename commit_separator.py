import os
import subprocess

def run(cmd):
    return subprocess.check_output(cmd, shell=True, text=True)

# 1. Get all changes
status_lines = run("git status --porcelain").strip().split('\n')
if not status_lines or status_lines == ['']:
    print("No changes.")
    exit(0)

changes = []
for line in status_lines:
    if len(line) < 4: continue
    status = line[:2]
    file = line[3:]
    # Remove surrounding quotes if git added them due to spaces
    if file.startswith('"') and file.endswith('"'):
        file = file[1:-1]
    # Sometimes renamed files look like 'R  old -> new', we just take the new part for simplicity
    if '->' in file:
        file = file.split('->')[-1].strip()
    changes.append((status, file))

# 2. Commit everything temporarily to preserve all state
os.system("git add -A")
os.system("git commit -m 'TEMP_BACKUP_DO_NOT_PUSH'")
temp_commit = run("git rev-parse HEAD").strip()

# 3. Reset working tree to the state before these changes
os.system("git reset --hard HEAD~1")

def apply_and_commit(files_to_commit, branch, prefix="update"):
    if not files_to_commit:
        return
    
    print(f"--- Processing branch: {branch} ({len(files_to_commit)} files) ---")
    
    # checkout the target branch
    # If it fails, maybe branch doesn't exist, try to create it or just skip
    res = os.system(f"git checkout {branch}")
    if res != 0:
        print(f"Failed to checkout {branch}. Falling back to develop.")
        os.system("git checkout develop")
    
    for status, file in files_to_commit:
        quoted_file = f'"{file}"'
        
        # If deleted
        if 'D' in status:
            os.system(f"git rm {quoted_file} >/dev/null 2>&1")
            os.system(f"rm -f {quoted_file} >/dev/null 2>&1")
            os.system(f"git add -u {quoted_file} >/dev/null 2>&1")
        else:
            # Checkout from temp backup
            os.system(f"git checkout {temp_commit} -- {quoted_file} >/dev/null 2>&1")
            os.system(f"git add {quoted_file} >/dev/null 2>&1")
            
        commit_msg = f"{prefix}: update {os.path.basename(file)}"
        
        # Commit if there are changes
        diff_status = os.system("git diff --cached --quiet")
        if diff_status != 0: # non-zero means changes exist
            os.system(f"git commit -m '{commit_msg}' >/dev/null 2>&1")
            print(f"Committed: {file}")

# 4. Split files according to user rules
frontend_files = [c for c in changes if c[1].startswith("AcademyFrontend/")]
courses_files = [c for c in changes if c[1].startswith("MLBackend/courses/")]
develop_files = [c for c in changes if not c[1].startswith("AcademyFrontend/") and not c[1].startswith("MLBackend/courses/")]

# 5. Apply and commit
apply_and_commit(frontend_files, "frontend", "feat(ui)")
apply_and_commit(courses_files, "courses", "feat(courses)")
apply_and_commit(develop_files, "develop", "chore")

# 6. Push to remote
print("Pushing all branches...")
os.system("git push origin frontend courses develop")

print("Done! The TEMP_BACKUP_DO_NOT_PUSH commit is detached and will be garbage collected.")
