import os

# 우리가 꼭 확인해야 할 핵심 파일 목록
files_to_read = [
    "next.config.ts",
    "api/function_app.py",
    "api/requirements.txt",
    "api/host.json",
    "app/page.tsx",
    ".github/workflows/azure-static-web-apps-ambitious-glacier-058088000.yml"
]

for file_path in files_to_read:
    print(f"\n{'='*20} [ FILE: {file_path} ] {'='*20}")
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            print(f.read())
    else:
        print("파일을 찾을 수 없습니다.")
    print(f"{'='*60}\n")