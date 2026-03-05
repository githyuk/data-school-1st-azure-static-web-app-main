import os

# 🔍 우리가 보고 싶은 파일들만 골라냅니다
target_extensions = ['.tsx', '.ts', '.py', '.js', '.json', '.yml', '.yaml', '.txt']
# 🚫 읽지 않을 폴더 (너무 긴 것들)
ignore_dirs = ['node_modules', '.next', '.git', '__pycache__', 'venv', '.vscode', '.idea']
# 🚫 읽지 않을 파일
ignore_files = ['package-lock.json', 'yarn.lock', 'show_code.py']

print("=== 🚀 프로젝트 전체 코드 추출 시작 ===")

for root, dirs, files in os.walk("."):
    # 무시할 폴더는 건너뜀
    dirs[:] = [d for d in dirs if d not in ignore_dirs]
    
    for file in files:
        if file in ignore_files: continue
        # 우리가 원하는 확장자만 읽음
        if any(file.endswith(ext) for ext in target_extensions):
            file_path = os.path.join(root, file)
            print(f"\n\nVVVVVVVVVV [ 파일 경로: {file_path} ] VVVVVVVVVV")
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    print(f.read())
            except Exception as e:
                print(f"(파일을 읽을 수 없음: {e})")
            print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")

print("\n=== 🏁 추출 끝! 위 내용을 복사해서 AI에게 주세요 ===")