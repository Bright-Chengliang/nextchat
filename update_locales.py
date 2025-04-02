import os
import re

# 获取 locales 目录下的所有 ts 文件
locales_dir = os.path.join(os.path.dirname(__file__), 'app', 'locales')
files = [f for f in os.listdir(locales_dir) if f.endswith('.ts') and f != 'index.ts']

# 已经修改过的文件
modified_files = ['cn.ts', 'ar.ts', 'en.ts', 'bn.ts']

# 遍历所有文件
for file in files:
    # 跳过已经修改过的文件
    if file in modified_files:
        print(f"跳过已修改的文件: {file}")
        continue

    file_path = os.path.join(locales_dir, file)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 查找 Access 部分中的 SaasStart 部分
    pattern = r'(Access:\s*{[\s\n]*)([ \t]*)(SaasStart:\s*{[^}]*},[^\n]*\n)'
    match = re.search(pattern, content, re.DOTALL)
    
    if match:
        # 获取匹配内容
        prefix = match.group(1)
        indentation = match.group(2)
        saas_start_block = match.group(3)
        
        # 注释掉 SaasStart 部分
        commented_lines = []
        for line in saas_start_block.split('\n'):
            if line.strip():
                commented_lines.append(f"{indentation}// {line.strip()}")
            else:
                commented_lines.append(line)
        
        commented_block = '\n'.join(commented_lines)
        
        # 替换原内容
        modified_content = content.replace(
            prefix + saas_start_block, 
            prefix + commented_block + '\n'
        )
        
        # 写入修改后的内容
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(modified_content)
        
        print(f"已修改文件: {file}")
    else:
        print(f"文件 {file} 中未找到 SaasStart 部分或格式不匹配")

print("所有文件处理完成！")
